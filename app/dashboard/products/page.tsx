'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/SidebarNav';

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
    setForm({ name: p.name, description: p.description || '', category: p.category || '', price_fixed: p.price_fixed || '', price_min: p.price_min || '', price_max: p.price_max || '', image_url: p.image_url || '', available: p.available });
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5eaf0', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a2942' }}>Catalogue produits</div>
          <button onClick={openAdd} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            + Ajouter un article
          </button>
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {loading && <div style={{ fontSize: '13px', color: '#8899bb' }}>Chargement...</div>}

          {!loading && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8899bb' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛍️</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#1a2942' }}>Aucun article</div>
              <div style={{ fontSize: '13px' }}>Ajoutez vos premiers articles au catalogue</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5eaf0' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '170px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>🛍️</div>
                )}
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a2942' }}>{p.name}</div>
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: p.available ? '#e6f7ee' : '#fdecea', color: p.available ? '#0a7c3e' : '#c0392b', fontWeight: 500, flexShrink: 0, marginLeft: '6px' }}>
                      {p.available ? 'Dispo' : 'Indispo'}
                    </span>
                  </div>
                  {p.category && <div style={{ fontSize: '11px', color: '#8899bb', marginBottom: '4px' }}>{p.category}</div>}
                  {p.description && <div style={{ fontSize: '12px', color: '#667788', marginBottom: '8px', lineHeight: 1.4 }}>{p.description}</div>}
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#25D366', marginBottom: '12px' }}>
                    {p.price_fixed
                      ? `${p.price_fixed.toLocaleString()} FCFA`
                      : `${p.price_min?.toLocaleString()} – ${p.price_max?.toLocaleString()} FCFA`}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(p)} style={{ flex: 1, padding: '7px', border: '1px solid #e5eaf0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', background: '#fff', color: '#1a2942', fontWeight: 500 }}>Modifier</button>
                    <button onClick={async () => { if (confirm('Supprimer ?')) { await fetch(`/api/dashboard/products?id=${p.id}`, { method: 'DELETE' }); loadProducts(); } }}
                      style={{ flex: 1, padding: '7px', border: '1px solid #fdecea', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', background: '#fdecea', color: '#c0392b', fontWeight: 500 }}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26,41,66,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2942' }}>
                {editing ? 'Modifier l\'article' : 'Ajouter un article'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8899bb' }}>×</button>
            </div>

            {[
              { label: 'Nom de l\'article *', key: 'name', placeholder: 'Ex: Robe de soirée' },
              { label: 'Catégorie', key: 'category', placeholder: 'Ex: Robes, Jeans...' },
              { label: 'Description', key: 'description', placeholder: 'Description optionnelle' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1a2942', marginBottom: '6px' }}>{label}</label>
                <input
                  type="text" placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5eaf0', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none', color: '#1a2942' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1a2942', marginBottom: '8px' }}>Prix</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  { label: 'Prix fixe', key: 'price_fixed', placeholder: '15000' },
                  { label: 'Prix min', key: 'price_min', placeholder: '8000' },
                  { label: 'Prix max', key: 'price_max', placeholder: '15000' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: '11px', color: '#8899bb' }}>{label} (FCFA)</label>
                    <input
                      type="number" placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #e5eaf0', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box', outline: 'none', color: '#1a2942' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1a2942', marginBottom: '6px' }}>Photo (optionnelle)</label>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ fontSize: '12px', color: '#1a2942' }} />
              {uploading && <div style={{ fontSize: '12px', color: '#25D366', marginTop: '4px' }}>Upload en cours...</div>}
              {form.image_url && <img src={form.image_url} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#1a2942' }}>
                <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                Article disponible
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e5eaf0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', background: '#fff', color: '#1a2942', fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving || !form.name} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '8px', cursor: saving || !form.name ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, background: saving || !form.name ? '#ccc' : '#25D366', color: '#fff' }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}