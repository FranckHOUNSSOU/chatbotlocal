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
    system: `Tu es l'assistant virtuel du Restaurant Chez Paul à Cotonou.
Réponds toujours en français, sois chaleureux et professionnel.
Horaires : Lundi-Dimanche 11h-22h.
Menu : Thiéboudienne 2000 FCFA, Poulet braisé 3500 FCFA, Jus bissap 500 FCFA.
Pour les réservations, demande le nom, le nombre de personnes et l'heure.`,
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