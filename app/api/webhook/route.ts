import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

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
- Si le client insiste encore en dessous du minimum, dis que c'est impossible mais offre un petit cadeau (ex: une ceinture gratuite)
- Ne cède pas trop vite — dis d'abord "Aïe, c'est vraiment mon meilleur prix" avant de baisser

HORAIRES : Lundi-Samedi 9h-20h, Dimanche 10h-17h
LOCALISATION : Quartier Cadjehoun, Cotonou, près du carrefour Cadjehoun
LIVRAISON : Disponible dans Cotonou pour 1 000 FCFA`,
    messages,
  });

  const reply = (response.content[0] as any).text;

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