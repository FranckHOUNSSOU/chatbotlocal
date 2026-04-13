'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, clients: 0, transferts: 0 });

  useEffect(() => {
    fetch('/api/dashboard/conversations')
      .then(r => r.json())
      .then(data => {
        const phones = Object.keys(data);
        const total = phones.reduce((acc, p) => acc + data[p].length, 0);
        const transferts = phones.filter(p =>
          data[p].some((m: any) => m.role === 'user' && m.message?.includes('réclamation'))
        ).length;
        setStats({ total, clients: phones.length, transferts });
      }).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>

      {/* Sidebar */}
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
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', background: '#25D366', color: '#fff', fontSize: '13px', textDecoration: 'none', marginBottom: '2px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
            Vue d'ensemble
          </Link>
          <Link href="/dashboard/conversations" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', color: '#8899bb', fontSize: '13px', textDecoration: 'none', marginBottom: '2px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h8v2H2z"/></svg>
            Conversations
          </Link>

          <div style={{ fontSize: '10px', color: '#4a6080', letterSpacing: '1.5px', padding: '14px 8px 6px', fontWeight: 600 }}>GESTION</div>
          <Link href="/dashboard/products" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', color: '#8899bb', fontSize: '13px', textDecoration: 'none', marginBottom: '2px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="8" rx="1.5"/><rect x="9" y="7" width="6" height="8" rx="1.5"/><rect x="1" y="11" width="6" height="4" rx="1.5"/><rect x="9" y="1" width="6" height="4" rx="1.5"/></svg>
            Catalogue
          </Link>
          <Link href="/dashboard/config" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', color: '#8899bb', fontSize: '13px', textDecoration: 'none', marginBottom: '2px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="3" fill="currentColor"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            Configuration
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5eaf0', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a2942' }}>Vue d'ensemble</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#e6f7ee', color: '#0a7c3e', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }}>● Bot actif</div>
            <div style={{ fontSize: '12px', color: '#8899bb' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Messages total', value: stats.total, sub: 'Depuis le début', icon: '💬', bg: '#e6f7ee', color: '#25D366' },
              { label: 'Clients actifs', value: stats.clients, sub: 'Numéros uniques', icon: '👤', bg: '#e8eeff', color: '#3b5bdb' },
              { label: 'Taux de réponse', value: '98%', sub: 'Excellent', icon: '⭐', bg: '#fff4e6', color: '#e67e22' },
              { label: 'Transferts', value: stats.transferts, sub: 'À gérer', icon: '🚨', bg: '#fdecea', color: '#e74c3c' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5eaf0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontSize: '16px' }}>{s.icon}</div>
                <div style={{ fontSize: '11px', color: '#8899bb', letterSpacing: '0.5px', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#1a2942', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: s.color, marginTop: '6px', fontWeight: 500 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>

            {/* Donut 1 */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5eaf0' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942', marginBottom: '16px' }}>Répartition messages</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#f0f4f8" strokeWidth="14"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#25D366" strokeWidth="14" strokeDasharray="132 88" strokeDashoffset="0" transform="rotate(-90 45 45)"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#3b5bdb" strokeWidth="14" strokeDasharray="53 167" strokeDashoffset="-132" transform="rotate(-90 45 45)"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#e67e22" strokeWidth="14" strokeDasharray="35 185" strokeDashoffset="-185" transform="rotate(-90 45 45)"/>
                  <text x="45" y="43" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a2942">{stats.total}</text>
                  <text x="45" y="55" textAnchor="middle" fontSize="9" fill="#8899bb">total</text>
                </svg>
                <div style={{ flex: 1, fontSize: '11px', color: '#667788' }}>
                  {[['#25D366', 'Bot répondus', '60%'], ['#3b5bdb', 'Produits', '24%'], ['#e67e22', 'Réclamations', '16%']].map(([c, l, v]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, flexShrink: 0 }}></div>
                      <span>{l}</span>
                      <span style={{ fontWeight: 600, color: '#1a2942', marginLeft: 'auto' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Donut 2 */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5eaf0' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942', marginBottom: '16px' }}>Satisfaction client</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#f0f4f8" strokeWidth="14"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#25D366" strokeWidth="14" strokeDasharray="196 24" strokeDashoffset="0" transform="rotate(-90 45 45)"/>
                  <text x="45" y="43" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1a2942">94%</text>
                  <text x="45" y="55" textAnchor="middle" fontSize="9" fill="#8899bb">satisfaits</text>
                </svg>
                <div style={{ flex: 1, fontSize: '11px', color: '#667788' }}>
                  {[['#25D366', 'Satisfaits', '94%'], ['#e5eaf0', 'Insatisfaits', '6%']].map(([c, l, v]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, border: '1px solid #ddd', flexShrink: 0 }}></div>
                      <span>{l}</span>
                      <span style={{ fontWeight: 600, color: '#1a2942', marginLeft: 'auto' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5eaf0' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942', marginBottom: '16px' }}>Activité hebdo</div>
              <svg width="100%" height="90" viewBox="0 0 200 80">
                <line x1="0" y1="70" x2="200" y2="70" stroke="#e5eaf0" strokeWidth="1"/>
                {[
                  [5, 40, 30], [35, 25, 45], [65, 35, 35],
                  [95, 15, 55], [125, 30, 40], [155, 20, 50]
                ].map(([x, y, h], i) => (
                  <rect key={i} x={x} y={y} width="22" height={h} rx="4" fill={i % 2 === 0 ? '#25D36688' : '#25D366'}/>
                ))}
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d, i) => (
                  <text key={d} x={16 + i * 30} y="78" textAnchor="middle" fontSize="8" fill="#8899bb">{d}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5eaf0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942' }}>Conversations récentes</div>
                <Link href="/dashboard/conversations" style={{ fontSize: '11px', color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>Voir tout →</Link>
              </div>
              {[
                { init: 'ML', name: 'Mélysane L.', msg: "J'ai commandé une robe...", time: '11:32', bg: '#e6f7ee', color: '#0a7c3e' },
                { init: 'AK', name: 'Afi K.', msg: 'Vous avez des jeans taille 38 ?', time: '10:19', bg: '#e8eeff', color: '#3b5bdb' },
                { init: 'CK', name: 'Charbel K.', msg: 'Bonjour, livrez-vous à Akpakpa ?', time: '09:45', bg: '#fff4e6', color: '#e67e22' },
                { init: 'GP', name: 'Godpeace O.', msg: "C'est combien la robe rouge ?", time: '09:02', bg: '#fdecea', color: '#e74c3c' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f0f4f8' : 'none' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.init}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a2942' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#8899bb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.msg}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#aabbcc', flexShrink: 0 }}>{c.time}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5eaf0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2942' }}>Alertes transfert</div>
                <span style={{ fontSize: '11px', color: '#25D366', cursor: 'pointer', fontWeight: 500 }}>Gérer →</span>
              </div>
              {[
                { phone: '+22947546405', msg: 'Réclamation livraison en attente', time: '11:47', color: '#e74c3c' },
                { phone: '+22961234567', msg: 'Commande spéciale hors catalogue', time: '10:33', color: '#e67e22' },
                { phone: '+22998765432', msg: 'Client insatisfait — suivi urgent', time: '09:15', color: '#e74c3c' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f0f4f8' : 'none' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#1a2942', fontWeight: 500 }}>{a.phone}</div>
                    <div style={{ fontSize: '11px', color: '#8899bb' }}>{a.msg}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#aabbcc', flexShrink: 0 }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}