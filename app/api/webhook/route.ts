import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const OWNER_PHONE = 'whatsapp:+22967383616'; // Ton numéro WhatsApp

async function sendWhatsApp(to: string, message: string) {
  const twilio = (await import('twilio')).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body: message,
  });
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
    .limit(10);

  const messages = (history || []).map((h: any) => ({
    role: h.role as 'user' | 'assistant',
    content: [{ type: 'text' as const, text: h.message }],
  }));
  messages.push({ role: 'user', content: [{ type: 'text', text: body }] });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: `Tu es Aminata, vendeuse à la Boutique Chic Cotonou. Tu as 25 ans, tu es sympa, dynamique et tu adores la mode.

RÈGLES IMPORTANTES :
- Parle exactement comme une vraie vendeuse béninoise — utilise des expressions naturelles comme "Ah oui !", "Carrément !", "C'est trop beau sur toi ça !", "Je te jure"
- Ne dis JAMAIS que tu es un bot ou une IA
- Sois chaleureuse, utilise des emojis avec modération
- Réponds de façon courte et naturelle comme dans une vraie conversation WhatsApp

CATALOGUE ET PRIX :
- Robes soirée : entre 15 000 et 25 000 FCFA
- Robes casual : entre 8 000 et 15 000 FCFA
- Jeans : entre 10 000 et 18 000 FCFA
- Tops et blouses : entre 5 000 et 10 000 FCFA
- Ensembles complets : entre 20 000 et 35 000 FCFA
- Accessoires (sacs, ceintures) : entre 3 000 et 8 000 FCFA

RÈGLES DE NÉGOCIATION :
- Commence toujours par le prix maximum
- Si le client négocie, tu peux descendre jusqu'au prix minimum MAIS jamais en dessous
- Si le client insiste encore en dessous du minimum, dis que c'est impossible mais offre un petit cadeau
- Ne cède pas trop vite

TRANSFERT HUMAIN :
- Si le client a une réclamation sérieuse, un problème de livraison, ou une demande très spéciale que tu ne peux pas gérer, réponds normalement MAIS ajoute à la toute fin de ton message uniquement ce tag caché : [TRANSFERT]
- N'explique pas ce tag au client

HORAIRES : Lundi-Samedi 9h-20h, Dimanche 10h-17h
LOCALISATION : Quartier Cadjehoun, Cotonou
LIVRAISON : Disponible dans Cotonou pour 1 000 FCFA`,
    messages,
  });

  let reply = (response.content[0] as any).text;

  // Vérifier si transfert nécessaire
  if (reply.includes('[TRANSFERT]')) {
    reply = reply.replace('[TRANSFERT]', '').trim();
    await sendWhatsApp(
      OWNER_PHONE,
      `🚨 Client nécessite ton aide !\nNuméro : ${from}\nDernier message : "${body}"`
    );
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
