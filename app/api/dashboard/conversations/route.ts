import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function GET() {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });

  const grouped = data.reduce((acc: any, msg: any) => {
    const phone = msg.phone_number;
    if (!acc[phone]) acc[phone] = [];
    acc[phone].push(msg);
    return acc;
  }, {});

  return NextResponse.json(grouped);
}