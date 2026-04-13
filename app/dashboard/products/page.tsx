'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    price_fixed: '', price_min: '', price_max: '',
    image_url: '', available: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    setLoading(true);
    fetch('/api/dashboard/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: '', price_fixed: '', price_min: '', price_max: '', image_url: '', available: true });
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', category: p.category || '',
      price_fixed: p.price_fixed || '', price_min: p.price_min || '',
      price_max: p.price_max || '', image_url: p.image_url || '', available: p.available,
    });
    setShowForm(true);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/dashboard/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setForm(f => ({ ...f, image_url: data.url }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      ...form,
      price_fixed: form.price_fixed ? parseInt(form.price_fixed as string) : null,
      price_min: form.price_min ? parseInt(form.price_min as string) : null,
      price_max: form.price_max ? parseInt(form.price_max as string) : null,
      ...(editing ? { id: editing.id } : {}),
    };
    await fetch('/api/dashboard/products', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setShowForm(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/dashboard/products?id=${id}`, { method: 'DELETE' });
    loadProducts();
  };

  const input = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#444' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={(form as any)[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
      />
    </div>
  );

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>← Retour</Link>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>Catalogue produits</h1>
        </div>
        <button onClick={openAdd} style={{ background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          + Ajouter un article
        </button>
      </div>

      {loading && <p style={{ color: '#666' }}>Chargement...</p>}

      {/* Grille produits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '180px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🛍️</div>
            )}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>{p.name}</h3>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: p.available ? '#e6f7ee' : '#ffeee6', color: p.available ? '#0a7c3e' : '#c0392b' }}>
                  {p.available ? 'Dispo' : 'Indispo'}
                </span>
              </div>
              {p.category && <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{p.category}</div>}
              {p.description && <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>{p.description}</p>}
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0070f3', marginBottom: '12px' }}>
                {p.price_fixed ? `${p.price_fixed.toLocaleString()} FCFA` : `${p.price_min?.toLocaleString()} - ${p.price_max?.toLocaleString()} FCFA`}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(p)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', background: 'white' }}>Modifier</button>
                <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: '8px', border: '1px solid #ffcdd2', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', background: '#fff5f5', color: '#c0392b' }}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              {editing ? 'Modifier l\'article' : 'Ajouter un article'}
            </h2>
            {input('Nom de l\'article *', 'name', 'text', 'Ex: Robe de soirée')}
            {input('Catégorie', 'category', 'text', 'Ex: Robes, Jeans, Tops...')}
            {input('Description', 'description', 'text', 'Description optionnelle')}
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#444' }}>Type de prix</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666' }}>Prix fixe (FCFA)</label>
                  <input type="number" placeholder="Ex: 15000" value={form.price_fixed} onChange={e => setForm(f => ({ ...f, price_fixed: e.target.value, price_min: '', price_max: '' }))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666' }}>Prix min (FCFA)</label>
                  <input type="number" placeholder="Ex: 8000" value={form.price_min} onChange={e => setForm(f => ({ ...f, price_min: e.target.value, price_fixed: '' }))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666' }}>Prix max (FCFA)</label>
                  <input type="number" placeholder="Ex: 15000" value={form.price_max} onChange={e => setForm(f => ({ ...f, price_max: e.target.value, price_fixed: '' }))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#444' }}>Photo (optionnelle)</label>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ fontSize: '13px' }} />
              {uploading && <p style={{ fontSize: '12px', color: '#0070f3', marginTop: '4px' }}>Upload en cours...</p>}
              {form.image_url && <img src={form.image_url} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                Article disponible
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', background: 'white' }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving || !form.name} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', background: saving || !form.name ? '#ccc' : '#0070f3', color: 'white' }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}