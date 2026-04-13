'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/SidebarNav';

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

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #e5eaf0',
    borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' as const,
    outline: 'none', color: '#1a2942', background: '#fff',
  };

  const labelStyle = {
    display: 'block' as const, fontSize: '12px',
    fontWeight: 600 as const, color: '#1a2942', marginBottom: '6px',
  };

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8899bb', fontSize: '14px' }}>Chargement...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5eaf0', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a2942' }}>Configuration du bot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saved && <span style={{ fontSize: '13px', color: '#25D366', fontWeight: 500 }}>✓ Sauvegardé !</span>}
            <button onClick={handleSave} disabled={saving} style={{ background: saving ? '#ccc' : '#25D366', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px', maxWidth: '1000px' }}>

            {/* Infos générales */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5eaf0' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a2942', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f0f4f8' }}>
                Informations générales
              </div>

              {[
                { label: 'Nom du bot', key: 'bot_name', placeholder: 'Ex: Aminata' },
                { label: 'Nom du business', key: 'business_name', placeholder: 'Ex: Boutique Chic Cotonou' },
                { label: 'Type de business', key: 'business_type', placeholder: 'Ex: boutique, restaurant...' },
                { label: 'Localisation', key: 'location', placeholder: 'Ex: Cadjehoun, Cotonou' },
                { label: 'Horaires', key: 'hours', placeholder: 'Ex: Lun-Sam 9h-20h' },
                { label: 'Livraison', key: 'delivery_info', placeholder: 'Ex: Cotonou 1 000 FCFA' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="text" placeholder={placeholder}
                    value={config?.[key] || ''}
                    onChange={e => setConfig((c: any) => ({ ...c, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '0' }}>
                <label style={labelStyle}>Numéro propriétaire (notifications)</label>
                <input
                  type="text" placeholder="Ex: whatsapp:+22967383616"
                  value={config?.owner_phone || ''}
                  onChange={e => setConfig((c: any) => ({ ...c, owner_phone: e.target.value }))}
                  style={inputStyle}
                />
                <div style={{ fontSize: '11px', color: '#8899bb', marginTop: '4px' }}>
                  Format : whatsapp:+229XXXXXXXX
                </div>
              </div>
            </div>

            {/* Prompt personnalisé */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5eaf0' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a2942', marginBottom: '8px', paddingBottom: '12px', borderBottom: '1px solid #f0f4f8' }}>
                Prompt personnalisé
              </div>
              <div style={{ fontSize: '12px', color: '#8899bb', marginBottom: '16px', lineHeight: 1.5 }}>
                Laissez vide pour utiliser le prompt automatique basé sur vos informations à gauche. Remplissez uniquement si vous souhaitez un comportement très spécifique.
              </div>

              <textarea
                placeholder={`Exemple :\nTu es Aminata, vendeuse à la Boutique Chic...\n\nRÈGLES :\n- Ne dis jamais que tu es un bot\n- Réponds en français\n...`}
                value={config?.system_prompt || ''}
                onChange={e => setConfig((c: any) => ({ ...c, system_prompt: e.target.value }))}
                rows={16}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontFamily: 'monospace', fontSize: '12px' }}
              />

              <div style={{ marginTop: '12px', padding: '12px', background: '#f0faf4', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a7c3e', marginBottom: '4px' }}>Astuce</div>
                <div style={{ fontSize: '11px', color: '#2d6a4f', lineHeight: 1.5 }}>
                  Le prompt automatique intègre déjà les informations générales et le catalogue produits. Utilisez le prompt personnalisé uniquement pour des cas très spécifiques.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}