'use client';
import { useEffect, useState } from 'react';
import SidebarNav from '../components/SidebarNav';

export default function Config() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/config')
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/dashboard/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <SidebarNav />
      <div className="flex-1 flex items-center justify-center text-sm text-[#8899bb]">Chargement...</div>
    </div>
  );

  const fields = [
    { label: 'Nom du bot', key: 'bot_name', placeholder: 'Ex: Aminata' },
    { label: 'Nom du business', key: 'business_name', placeholder: 'Ex: Boutique Chic Cotonou' },
    { label: 'Type de business', key: 'business_type', placeholder: 'Ex: boutique, restaurant, pharmacie...' },
    { label: 'Localisation', key: 'location', placeholder: 'Ex: Quartier Cadjehoun, Cotonou' },
    { label: 'Horaires', key: 'hours', placeholder: 'Ex: Lun-Sam 9h-20h, Dim 10h-17h' },
    { label: 'Livraison', key: 'delivery_info', placeholder: 'Ex: Disponible dans Cotonou pour 1 000 FCFA' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="bg-white border-b border-[#e5eaf0] px-6 h-14 flex items-center justify-between sticky top-0 z-30 mt-14 lg:mt-0">
          <h1 className="text-base font-semibold text-[#1a2942]">Configuration du bot</h1>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-[#25D366] font-medium">✓ Sauvegardé !</span>}
            <button onClick={handleSave} disabled={saving}
              className={`text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#1db954]'}`}>
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">

            {/* Infos générales */}
            <div className="bg-white rounded-xl border border-[#e5eaf0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f4f8]">
                <h2 className="text-sm font-bold text-[#1a2942]">Informations générales</h2>
                <p className="text-xs text-[#8899bb] mt-0.5">Ces infos sont injectées automatiquement dans le bot</p>
              </div>
              <div className="p-6 space-y-4">
                {fields.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-[#1a2942] mb-1.5">{label}</label>
                    <input type="text" placeholder={placeholder}
                      value={config?.[key] || ''}
                      onChange={e => setConfig((c: any) => ({ ...c, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[#e5eaf0] rounded-lg text-sm text-[#1a2942] outline-none focus:border-[#25D366] transition-colors bg-white"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-[#1a2942] mb-1.5">Numéro propriétaire (notifications)</label>
                  <input type="text" placeholder="Ex: whatsapp:+22967383616"
                    value={config?.owner_phone || ''}
                    onChange={e => setConfig((c: any) => ({ ...c, owner_phone: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-[#e5eaf0] rounded-lg text-sm text-[#1a2942] outline-none focus:border-[#25D366] transition-colors bg-white"
                  />
                  <p className="text-[10px] text-[#8899bb] mt-1">Format : whatsapp:+229XXXXXXXX</p>
                </div>
              </div>
            </div>

            {/* Prompt personnalisé */}
            <div className="bg-white rounded-xl border border-[#e5eaf0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f4f8]">
                <h2 className="text-sm font-bold text-[#1a2942]">Prompt personnalisé</h2>
                <p className="text-xs text-[#8899bb] mt-0.5">Laissez vide pour utiliser le prompt automatique</p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <textarea
                  placeholder={`Exemple :\nTu es Aminata, vendeuse à la Boutique Chic...\n\nRÈGLES :\n- Ne dis jamais que tu es un bot\n- Réponds en français\n...`}
                  value={config?.system_prompt || ''}
                  onChange={e => setConfig((c: any) => ({ ...c, system_prompt: e.target.value }))}
                  rows={14}
                  className="w-full px-3 py-2.5 border border-[#e5eaf0] rounded-lg text-xs text-[#1a2942] outline-none focus:border-[#25D366] transition-colors resize-vertical font-mono leading-relaxed bg-white"
                />

                <div className="bg-[#f0faf4] rounded-lg p-4 border border-[#c3e6cb]">
                  <div className="text-xs font-bold text-[#0a7c3e] mb-1">Astuce</div>
                  <div className="text-xs text-[#2d6a4f] leading-relaxed">
                    Le prompt automatique intègre déjà vos informations générales et le catalogue produits. Utilisez le prompt personnalisé uniquement pour des comportements très spécifiques.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}