'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SidebarNav from './components/SidebarNav';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, clients: 0, transferts: 0 });

  useEffect(() => {
    fetch('/api/dashboard/conversations')
      .then(r => r.json())
      .then(data => {
        const phones = Object.keys(data);
        const total = phones.reduce((acc, p) => acc + data[p].length, 0);
        setStats({ total, clients: phones.length, transferts: 0 });
      }).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="bg-white border-b border-[#e5eaf0] px-6 h-14 flex items-center justify-between sticky top-0 z-30 mt-14 lg:mt-0">
          <h1 className="text-base font-semibold text-[#1a2942]">Vue d'ensemble</h1>
          <div className="flex items-center gap-3">
            <span className="bg-[#e6f7ee] text-[#0a7c3e] text-xs px-3 py-1 rounded-full font-medium">● Bot actif</span>
            <span className="text-xs text-[#8899bb] hidden sm:block">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        <div className="p-4 lg:p-6 overflow-y-auto flex-1">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Messages total', value: stats.total, sub: 'Depuis le début', color: '#25D366', bg: '#e6f7ee' },
              { label: 'Clients actifs', value: stats.clients, sub: 'Numéros uniques', color: '#3b5bdb', bg: '#e8eeff' },
              { label: 'Taux de réponse', value: '98%', sub: 'Excellent', color: '#e67e22', bg: '#fff4e6' },
              { label: 'Transferts', value: stats.transferts, sub: 'À gérer', color: '#e74c3c', bg: '#fdecea' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[#e5eaf0]">
                <div className="text-xs text-[#8899bb] font-medium uppercase tracking-wide mb-2">{s.label}</div>
                <div className="text-2xl font-bold text-[#1a2942]">{s.value}</div>
                <div className="text-xs font-medium mt-1" style={{ color: s.color }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* Donut 1 */}
            <div className="bg-white rounded-xl p-5 border border-[#e5eaf0]">
              <div className="text-sm font-semibold text-[#1a2942] mb-4">Répartition messages</div>
              <div className="flex items-center gap-4">
                <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#f0f4f8" strokeWidth="14"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#25D366" strokeWidth="14" strokeDasharray="132 88" strokeDashoffset="0" transform="rotate(-90 45 45)"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#3b5bdb" strokeWidth="14" strokeDasharray="53 167" strokeDashoffset="-132" transform="rotate(-90 45 45)"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#e67e22" strokeWidth="14" strokeDasharray="35 185" strokeDashoffset="-185" transform="rotate(-90 45 45)"/>
                  <text x="45" y="43" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a2942">{stats.total}</text>
                  <text x="45" y="55" textAnchor="middle" fontSize="9" fill="#8899bb">total</text>
                </svg>
                <div className="flex-1 text-xs text-[#667788] space-y-1.5">
                  {[['#25D366', 'Bot', '60%'], ['#3b5bdb', 'Produits', '24%'], ['#e67e22', 'Réclamations', '16%']].map(([c, l, v]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }}/>
                      <span className="flex-1">{l}</span>
                      <span className="font-semibold text-[#1a2942]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Donut 2 */}
            <div className="bg-white rounded-xl p-5 border border-[#e5eaf0]">
              <div className="text-sm font-semibold text-[#1a2942] mb-4">Satisfaction client</div>
              <div className="flex items-center gap-4">
                <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#f0f4f8" strokeWidth="14"/>
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#25D366" strokeWidth="14" strokeDasharray="196 24" strokeDashoffset="0" transform="rotate(-90 45 45)"/>
                  <text x="45" y="43" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1a2942">94%</text>
                  <text x="45" y="55" textAnchor="middle" fontSize="9" fill="#8899bb">satisfaits</text>
                </svg>
                <div className="flex-1 text-xs text-[#667788] space-y-1.5">
                  {[['#25D366', 'Satisfaits', '94%'], ['#e5eaf0', 'Insatisfaits', '6%']].map(([c, l, v]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full border border-[#ddd] flex-shrink-0" style={{ background: c }}/>
                      <span className="flex-1">{l}</span>
                      <span className="font-semibold text-[#1a2942]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-xl p-5 border border-[#e5eaf0]">
              <div className="text-sm font-semibold text-[#1a2942] mb-4">Activité hebdo</div>
              <svg width="100%" height="90" viewBox="0 0 200 80">
                <line x1="0" y1="70" x2="200" y2="70" stroke="#e5eaf0" strokeWidth="1"/>
                {[[5,40,30],[35,25,45],[65,35,35],[95,15,55],[125,30,40],[155,20,50]].map(([x,y,h],i) => (
                  <rect key={i} x={x} y={y} width="22" height={h} rx="4" fill={i%2===0?'#25D36688':'#25D366'}/>
                ))}
                {['Lun','Mar','Mer','Jeu','Ven','Sam'].map((d,i) => (
                  <text key={d} x={16+i*30} y="78" textAnchor="middle" fontSize="8" fill="#8899bb">{d}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <div className="bg-white rounded-xl p-5 border border-[#e5eaf0]">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-semibold text-[#1a2942]">Conversations récentes</div>
                <Link href="/dashboard/conversations" className="text-xs text-[#25D366] font-medium no-underline">Voir tout →</Link>
              </div>
              {[
                { init: 'ML', name: 'Mélysane L.', msg: "J'ai commandé une robe...", time: '11:32', bg: '#e6f7ee', color: '#0a7c3e' },
                { init: 'AK', name: 'Afi K.', msg: 'Vous avez des jeans taille 38 ?', time: '10:19', bg: '#e8eeff', color: '#3b5bdb' },
                { init: 'CK', name: 'Charbel K.', msg: 'Livrez-vous à Akpakpa ?', time: '09:45', bg: '#fff4e6', color: '#e67e22' },
                { init: 'GP', name: 'Godpeace O.', msg: "C'est combien la robe rouge ?", time: '09:02', bg: '#fdecea', color: '#e74c3c' },
              ].map((c, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 ${i<3?'border-b border-[#f0f4f8]':''}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: c.bg, color: c.color }}>{c.init}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#1a2942]">{c.name}</div>
                    <div className="text-xs text-[#8899bb] truncate">{c.msg}</div>
                  </div>
                  <div className="text-[10px] text-[#aabbcc] flex-shrink-0">{c.time}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#e5eaf0]">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-semibold text-[#1a2942]">Alertes transfert</div>
                <span className="text-xs text-[#25D366] font-medium cursor-pointer">Gérer →</span>
              </div>
              {[
                { phone: '+22947546405', msg: 'Réclamation livraison en attente', time: '11:47', color: '#e74c3c' },
                { phone: '+22961234567', msg: 'Commande spéciale hors catalogue', time: '10:33', color: '#e67e22' },
                { phone: '+22998765432', msg: 'Client insatisfait — suivi urgent', time: '09:15', color: '#e74c3c' },
              ].map((a, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 ${i<2?'border-b border-[#f0f4f8]':''}`}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }}/>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-[#1a2942]">{a.phone}</div>
                    <div className="text-xs text-[#8899bb]">{a.msg}</div>
                  </div>
                  <div className="text-[10px] text-[#aabbcc] flex-shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}