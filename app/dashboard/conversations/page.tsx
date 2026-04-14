'use client';
import { useEffect, useState } from 'react';
import SidebarNav from '../components/SidebarNav';

const ADMIN_PHONE = 'whatsapp:+22967383616';

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
  const isAdmin = (phone: string) => phone === ADMIN_PHONE;

  const ConvList = () => (
    <div className="flex-1 overflow-y-auto bg-white">
      {loading && <div className="p-5 text-sm text-[#8899bb]">Chargement...</div>}
      {!loading && phones.length === 0 && (
        <div className="p-10 text-center text-sm text-[#8899bb]">Aucune conversation</div>
      )}
      {phones.map(phone => {
        const msgs = grouped[phone];
        const last = msgs[0];
        const admin = isAdmin(phone);
        return (
          <div key={phone} onClick={() => setSelected(phone)}
            className="px-4 py-3 cursor-pointer border-b border-[#f0f4f8] hover:bg-[#f8fafc] active:bg-[#f0faf4] transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${admin ? 'bg-[#fff8e1] text-[#b8860b] ring-2 ring-[#ffd700]' : 'bg-[#e6f7ee] text-[#0a7c3e]'}`}>
                {phone.replace('whatsapp:+', '').slice(-2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-[#1a2942] truncate">
                    {phone.replace('whatsapp:', '')}
                  </span>
                  {admin && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: '#fff8e1', color: '#b8860b', border: '1px solid #ffd700' }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#8899bb] truncate">{last?.message}</div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="text-[10px] text-[#aabbcc]">
                  {new Date(last?.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-[10px] text-[#aabbcc]">{msgs.length} msg</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ConvMessages = () => (
    <div className="flex flex-col overflow-hidden bg-[#f8fafc]" style={{ height: '100%' }}>
      {/* Header fixe avec bouton retour */}
      <div className="px-4 py-3 bg-white border-b border-[#e5eaf0] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => setSelected(null)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f0f4f8] hover:bg-[#e5eaf0] transition-colors flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2942" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isAdmin(selected!) ? 'bg-[#fff8e1] text-[#b8860b] ring-2 ring-[#ffd700]' : 'bg-[#e6f7ee] text-[#0a7c3e]'}`}>
          {selected!.replace('whatsapp:+', '').slice(-2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1a2942] truncate">
              {selected!.replace('whatsapp:', '')}
            </span>
            {isAdmin(selected!) && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: '#fff8e1', color: '#b8860b', border: '1px solid #ffd700' }}>
                ADMIN
              </span>
            )}
          </div>
          <div className="text-xs text-[#25D366]">
            {grouped[selected!]?.length} messages
          </div>
        </div>
      </div>

      {/* Messages scrollables */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {grouped[selected!]?.slice().reverse().map((msg: any, i: number) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-white text-[#1a2942] border border-[#e5eaf0] rounded-tl-sm'
                : 'bg-[#1a2942] text-white rounded-tr-sm'
            }`}>
              {msg.message}
              <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-[#aabbcc]' : 'text-white/50'}`}>
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar desktop + mobile sans conversation sélectionnée */}
        <div className={`bg-white border-b border-[#e5eaf0] px-6 h-14 items-center justify-between sticky top-0 z-30 mt-14 lg:mt-0 ${selected ? 'hidden lg:flex' : 'flex'}`}>
          <h1 className="text-base font-semibold text-[#1a2942]">Conversations</h1>
          <span className="text-xs text-[#8899bb]">{phones.length} client{phones.length > 1 ? 's' : ''}</span>
        </div>

        {/* Mobile */}
        <div className="flex-1 flex flex-col overflow-hidden lg:hidden" style={{ height: 'calc(100dvh - 112px)' }}>
          {!selected ? <ConvList /> : <ConvMessages />}
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="w-80 flex-shrink-0 border-r border-[#e5eaf0] flex flex-col overflow-hidden">
            <ConvList />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-[#aabbcc]">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-40">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  <div className="text-sm">Sélectionnez une conversation</div>
                </div>
              </div>
            ) : <ConvMessages />}
          </div>
        </div>

      </div>
    </div>
  );
}