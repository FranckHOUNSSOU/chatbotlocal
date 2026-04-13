import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function sendWhatsApp(to: string, message: string, ownerPhone: string) {
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  await twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body: message,
  });
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

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = formData.get('From') as string;
  const body = formData.get('Body') as string;

  const { data: history } = await supabase
    .from('conversations')
    .select('role, message')
    .eq('phone_number', from)
    .order('created_at', { ascending: true })
    .limit(20);

  const messages = (history || []).map((h: any) => ({
    role: h.role as 'user' | 'assistant',
    content: [{ type: 'text' as const, text: h.message }],
  }));
  messages.push({ role: 'user', content: [{ type: 'text', text: body }] });

  const { prompt, ownerPhone } = await buildSystemPrompt();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: prompt,
    messages,
  });

  let reply = (response.content[0] as any).text;

  if (reply.includes('[TRANSFERT]') && ownerPhone) {
    reply = reply.replace('[TRANSFERT]', '').trim();
    try {
      await sendWhatsApp(
        ownerPhone,
        `🚨 Client nécessite ton aide !\nNuméro : ${from}\nDernier message : "${body}"`,
        ownerPhone
      );
    } catch (e) {
      console.error('Erreur notification:', e);
    }
  }

  await supabase.from('conversations').insert([
    { phone_number: from, role: 'user', message: body },
    { phone_number: from, role: 'assistant', message: reply },
  ]);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response><Message>${reply}</Message></Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}