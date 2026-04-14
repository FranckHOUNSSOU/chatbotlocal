import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';

async function sendWhatsApp(to: string, message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Erreur envoi WhatsApp:', error);
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function buildSystemPrompt(): Promise<{ prompt: string; ownerPhone: string }> {
  const { data: config } = await supabase.from('bot_config').select('*').single();
  const { data: products } = await supabase.from('products').select('*').eq('available', true);

  if (config?.system_prompt) {
    return { prompt: config.system_prompt, ownerPhone: config.owner_phone };
  }

  let catalogue = '';
  if (products && products.length > 0) {
    catalogue = '\n\nCATALOGUE DISPONIBLE :\n';
    products.forEach((p: any) => {
      catalogue += `- ${p.name}`;
      if (p.category) catalogue += ` (${p.category})`;
      if (p.price_fixed) catalogue += ` : ${p.price_fixed.toLocaleString()} FCFA`;
      else if (p.price_min && p.price_max) catalogue += ` : entre ${p.price_min.toLocaleString()} et ${p.price_max.toLocaleString()} FCFA`;
      if (p.description) catalogue += ` — ${p.description}`;
      catalogue += '\n';
    });
  }

  const prompt = `Tu es ${config?.bot_name || 'un assistant'}, vendeur(se) à ${config?.business_name || 'notre boutique'}.

RÈGLES IMPORTANTES :
- Parle exactement comme un(e) vrai(e) vendeur(se) béninois(e) — utilise des expressions naturelles et chaleureuses
- Ne dis JAMAIS que tu es un bot ou une IA
- Sois chaleureux(se), utilise des emojis avec modération
- Réponds de façon courte et naturelle comme dans une vraie conversation WhatsApp

RÈGLES DE NÉGOCIATION :
- Commence toujours par le prix maximum
- Tu peux descendre jusqu'au prix minimum MAIS jamais en dessous
- Si le client insiste en dessous du minimum, dis que c'est impossible mais offre un petit cadeau
- Ne cède pas trop vite${catalogue}

HORAIRES : ${config?.hours || 'Nous contacter pour les horaires'}
LOCALISATION : ${config?.location || ''}
LIVRAISON : ${config?.delivery_info || ''}

TRANSFERT HUMAIN :
- Si le client a une réclamation sérieuse ou une demande que tu ne peux pas gérer, réponds normalement MAIS ajoute à la fin : [TRANSFERT]
- N'explique jamais ce tag au client`;

  return { prompt, ownerPhone: config?.owner_phone || '' };
}

// GET : vérification du webhook par Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'wabot_verify_token';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook vérifié avec succès');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// POST : réception des messages WhatsApp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Vérifier que c'est bien un message WhatsApp
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      // Peut être un status update, on ignore
      return NextResponse.json({ status: 'ok' });
    }

    const message = messages[0];
    const from = message.from; // numéro de l'expéditeur
    const messageText = message?.text?.body;

    if (!messageText) {
      // Message non-texte (image, audio...), on ignore pour l'instant
      return NextResponse.json({ status: 'ok' });
    }

    // Récupérer l'historique de conversation
    const { data: history } = await supabase
      .from('conversations')
      .select('role, message')
      .eq('phone_number', from)
      .order('created_at', { ascending: true })
      .limit(20);

    const conversationMessages = (history || []).map((h: any) => ({
      role: h.role as 'user' | 'assistant',
      content: [{ type: 'text' as const, text: h.message }],
    }));
    conversationMessages.push({ role: 'user', content: [{ type: 'text', text: messageText }] });

    const { prompt, ownerPhone } = await buildSystemPrompt();

    // Appel Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: prompt,
      messages: conversationMessages,
    });

    let reply = (response.content[0] as any).text;

    // Gestion du transfert
    if (reply.includes('[TRANSFERT]') && ownerPhone) {
      reply = reply.replace('[TRANSFERT]', '').trim();
      try {
        await sendWhatsApp(
          ownerPhone,
          `🚨 Client nécessite ton aide !\nNuméro : ${from}\nDernier message : "${messageText}"`
        );
      } catch (e) {
        console.error('Erreur notification:', e);
      }
    }

    // Envoyer la réponse au client
    await sendWhatsApp(from, reply);

    // Sauvegarder dans Supabase
    await supabase.from('conversations').insert([
      { phone_number: from, role: 'user', message: messageText },
      { phone_number: from, role: 'assistant', message: reply },
    ]);

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}