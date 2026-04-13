'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SidebarNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const navItem = (href: string, label: string, icon: React.ReactNode) => {
    const active = path === href;
    return (
      <Link href={href} onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 ${active ? 'bg-[#25D366] text-white' : 'text-[#8899bb] hover:bg-white/10 hover:text-white'}`}>
        {icon}
        {label}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="3" width="14" height="11" rx="3" fill="white"/>
              <polygon points="3,14 1,18 7,14" fill="white"/>
              <circle cx="5" cy="8.5" r="1.5" fill="#25D366"/>
              <circle cx="8" cy="8.5" r="1.5" fill="#25D366"/>
              <circle cx="11" cy="8.5" r="1.5" fill="#25D366"/>
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-white leading-none">
              <span className="text-[#25D366]">Wa</span>Bot
            </div>
            <div className="text-[10px] text-[#4a6080] tracking-widest mt-0.5">DASHBOARD</div>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4 flex-1">
        <div className="text-[10px] text-[#4a6080] tracking-widest px-2 pb-2 font-semibold">PRINCIPAL</div>
        {navItem('/dashboard', 'Vue d\'ensemble',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
        )}
        {navItem('/dashboard/conversations', 'Conversations',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h8v2H2z"/></svg>
        )}
        <div className="text-[10px] text-[#4a6080] tracking-widest px-2 pt-4 pb-2 font-semibold">GESTION</div>
        {navItem('/dashboard/products', 'Catalogue',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="8" rx="1.5"/><rect x="9" y="7" width="6" height="8" rx="1.5"/><rect x="1" y="11" width="6" height="4" rx="1.5"/><rect x="9" y="1" width="6" height="4" rx="1.5"/></svg>
        )}
        {navItem('/dashboard/config', 'Configuration',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="3" fill="currentColor"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a2942] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="3" width="14" height="11" rx="3" fill="white"/>
              <polygon points="3,14 1,18 7,14" fill="white"/>
              <circle cx="5" cy="8.5" r="1.5" fill="#25D366"/>
              <circle cx="8" cy="8.5" r="1.5" fill="#25D366"/>
              <circle cx="11" cy="8.5" r="1.5" fill="#25D366"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg"><span className="text-[#25D366]">Wa</span>Bot</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white p-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)}/>}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 z-50 h-full w-60 bg-[#1a2942] flex flex-col transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1a2942] h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}