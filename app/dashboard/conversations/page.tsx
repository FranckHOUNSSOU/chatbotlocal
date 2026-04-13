'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/SidebarNav';

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5eaf0', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a2942' }}>Conversations</div>
          <div style={{ fontSize: '12px', color: '#8899bb' }}>{phones.length} client{phones.length > 1 ? 's' : ''}</div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden', height: 'calc(100vh - 56px)' }}>

          {/* Liste clients */}
          <div style={{ background: '#fff', borderRight: '1px solid #e5eaf0', overflowY: 'auto' }}>
            {loading && <div style={{ padding: '20px', fontSize: '13px', color: '#8899bb' }}>Chargement...</div>}
            {!loading && phones.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '13px', color: '#8899bb' }}>
                Aucune conversation
              </div>
            )}
            {phones.map(phone => {
              const msgs = grouped[phone];
              const last = msgs[0];
              const active = selected === phone;
              return (
                <div key={phone} onClick={() => setSelected(phone)} style={{
                  padding: '14px 16px', cursor: 'pointer',
                  borderBottom: '1px solid #f0f4f8',
                  background: active ? '#f0faf4' : 'white',
                  borderLeft: active ? '3px solid #25D366' : '3px solid transparent',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e6f7ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#0a7c3e', flexShrink: 0 }}>
                      {phone.replace('whatsapp:+', '').slice(-2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942' }}>
                        {phone.replace('whatsapp:', '')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8899bb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {last?.message}
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#aabbcc', flexShrink: 0 }}>
                      {new Date(last?.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#aabbcc', marginTop: '4px', marginLeft: '46px' }}>
                    {msgs.length} message{msgs.length > 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!selected ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aabbcc', fontSize: '14px' }}>
                Sélectionnez une conversation
              </div>
            ) : (
              <>
                <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e5eaf0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e6f7ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#0a7c3e' }}>
                    {selected.replace('whatsapp:+', '').slice(-2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942' }}>{selected.replace('whatsapp:', '')}</div>
                    <div style={{ fontSize: '11px', color: '#25D366' }}>● En ligne</div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
                  {grouped[selected]?.slice().reverse().map((msg: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end' }}>
                      <div style={{
                        maxWidth: '65%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        background: msg.role === 'user' ? '#fff' : '#1a2942',
                        color: msg.role === 'user' ? '#1a2942' : '#fff',
                        fontSize: '13px', lineHeight: '1.5',
                        border: msg.role === 'user' ? '1px solid #e5eaf0' : 'none',
                      }}>
                        {msg.message}
                        <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px', textAlign: 'right' }}>
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}