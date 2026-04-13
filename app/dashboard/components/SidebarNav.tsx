'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const path = usePathname();

  const navItem = (href: string, label: string, icon: React.ReactNode) => {
    const active = path === href;
    return (
      <Link href={href} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 10px', borderRadius: '8px',
        background: active ? '#25D366' : 'transparent',
        color: active ? '#fff' : '#8899bb',
        fontSize: '13px', textDecoration: 'none', marginBottom: '2px',
        transition: 'background 0.15s'
      }}>
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <aside style={{ width: '240px', background: '#1a2942', display: 'flex', flexDirection: 'column', flexShrink: 0, minHeight: '100vh' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#25D366', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="3" width="14" height="11" rx="3" fill="white"/>
              <polygon points="3,14 1,18 7,14" fill="white"/>
              <circle cx="5" cy="8.5" r="1.5" fill="#25D366"/>
              <circle cx="8" cy="8.5" r="1.5" fill="#25D366"/>
              <circle cx="11" cy="8.5" r="1.5" fill="#25D366"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              <span style={{ color: '#25D366' }}>Wa</span>Bot
            </div>
            <div style={{ fontSize: '10px', color: '#4a6080', letterSpacing: '2px', marginTop: '2px' }}>DASHBOARD</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#4a6080', letterSpacing: '1.5px', padding: '8px 8px 6px', fontWeight: 600 }}>PRINCIPAL</div>
        {navItem('/dashboard', 'Vue d\'ensemble',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
        )}
        {navItem('/dashboard/conversations', 'Conversations',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h8v2H2z"/></svg>
        )}

        <div style={{ fontSize: '10px', color: '#4a6080', letterSpacing: '1.5px', padding: '14px 8px 6px', fontWeight: 600 }}>GESTION</div>
        {navItem('/dashboard/products', 'Catalogue',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="8" rx="1.5"/><rect x="9" y="7" width="6" height="8" rx="1.5"/><rect x="1" y="11" width="6" height="4" rx="1.5"/><rect x="9" y="1" width="6" height="4" rx="1.5"/></svg>
        )}
        {navItem('/dashboard/config', 'Configuration',
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="3" fill="currentColor"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
        )}
      </nav>
    </aside>
  );
}