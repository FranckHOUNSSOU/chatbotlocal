'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  const input = (label: string, key: string, placeholder = '') => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#444' }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={config?.[key] || ''}
        onChange={e => setConfig((c: any) => ({ ...c, [key]: e.target.value }))}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
      />
    </div>
  );

  if (loading) return <p style={{ fontFamily: 'sans-serif', padding: '20px' }}>Chargement...</p>;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>← Retour</Link>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>Configuration du bot</h1>
      </div>

      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>Informations générales</h2>
        {input('Nom du bot', 'bot_name', 'Ex: Aminata')}
        {input('Nom du business', 'business_name', 'Ex: Boutique Chic Cotonou')}
        {input('Type de business', 'business_type', 'Ex: boutique, restaurant, pharmacie...')}
        {input('Localisation', 'location', 'Ex: Quartier Cadjehoun, Cotonou')}
        {input('Horaires', 'hours', 'Ex: Lundi-Samedi 9h-20h')}
        {input('Livraison', 'delivery_info', 'Ex: Disponible dans Cotonou pour 1 000 FCFA')}
        {input('Numéro propriétaire (notifications)', 'owner_phone', 'Ex: whatsapp:+22967383616')}
      </div>

      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Prompt personnalisé</h2>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
          Laissez vide pour utiliser le prompt automatique basé sur vos informations ci-dessus.
        </p>
        <textarea
          placeholder="Écrivez ici un prompt personnalisé pour votre bot..."
          value={config?.system_prompt || ''}
          onChange={e => setConfig((c: any) => ({ ...c, system_prompt: e.target.value }))}
          rows={10}
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '12px 32px', background: saving ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          {saving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
        {saved && <span style={{ color: '#0a7c3e', fontSize: '14px', fontWeight: '500' }}>✓ Sauvegardé !</span>}
      </div>
    </div>
  );
}