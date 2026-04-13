'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Conversations() {
  const [grouped, setGrouped] = useState<any>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/conversations')
      .then(r => r.json())
      .then(data => { setGrouped(data); setLoading(false); });
  }, []);

  const phones = Object.keys(grouped);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>← Retour</Link>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>Conversations</h1>
      </div>

      {loading && <p style={{ color: '#666' }}>Chargement...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', minHeight: '500px' }}>
        
        {/* Liste des clients */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
          {phones.length === 0 && !loading && (
            <p style={{ padding: '20px', color: '#666', fontSize: '14px' }}>Aucune conversation</p>
          )}
          {phones.map(phone => {
            const msgs = grouped[phone];
            const last = msgs[0];
            return (
              <div
                key={phone}
                onClick={() => setSelected(phone)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  background: selected === phone ? '#f0f7ff' : 'white',
                  borderLeft: selected === phone ? '3px solid #0070f3' : '3px solid transparent',
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {phone.replace('whatsapp:', '')}
                </div>
                <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {last?.message}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  {new Date(last?.created_at).toLocaleString('fr-FR')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Messages de la conversation */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', overflowY: 'auto', maxHeight: '600px' }}>
          {!selected && (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '40px' }}>
              Sélectionnez une conversation
            </p>
          )}
          {selected && grouped[selected]?.slice().reverse().map((msg: any, i: number) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                marginBottom: '12px',
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '0 12px 12px 12px' : '12px 0 12px 12px',
                background: msg.role === 'user' ? '#f0f0f0' : '#0070f3',
                color: msg.role === 'user' ? '#1a1a1a' : 'white',
                fontSize: '14px',
                lineHeight: '1.5',
              }}>
                {msg.message}
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}