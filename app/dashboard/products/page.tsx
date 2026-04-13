'use client';
import { useEffect, useState } from 'react';
import SidebarNav from '../components/SidebarNav';

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
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
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
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="bg-white border-b border-[#e5eaf0] px-6 h-14 flex items-center justify-between sticky top-0 z-30 mt-14 lg:mt-0">
          <h1 className="text-base font-semibold text-[#1a2942]">Catalogue produits</h1>
          <button onClick={openAdd} className="bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1db954] transition-colors">
            + Ajouter un article
          </button>
        </div>

        <div className="p-4 lg:p-6 overflow-y-auto flex-1">
          {loading && <div className="text-sm text-[#8899bb]">Chargement...</div>}

          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-[#8899bb]">
              <div className="text-5xl mb-4">🛍️</div>
              <div className="text-base font-semibold text-[#1a2942] mb-2">Aucun article</div>
              <div className="text-sm">Ajoutez vos premiers articles au catalogue</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden border border-[#e5eaf0] flex flex-col">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-44 object-cover"/>
                ) : (
                  <div className="w-full h-44 bg-[#f0f4f8] flex items-center justify-center text-4xl">🛍️</div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-semibold text-[#1a2942] leading-tight flex-1 mr-2">{p.name}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${p.available ? 'bg-[#e6f7ee] text-[#0a7c3e]' : 'bg-[#fdecea] text-[#c0392b]'}`}>
                      {p.available ? 'Dispo' : 'Indispo'}
                    </span>
                  </div>
                  {p.category && <div className="text-xs text-[#8899bb] mb-1">{p.category}</div>}
                  {p.description && <div className="text-xs text-[#667788] mb-2 leading-relaxed flex-1">{p.description}</div>}
                  <div className="text-sm font-bold text-[#25D366] mb-3">
                    {p.price_fixed
                      ? `${p.price_fixed.toLocaleString()} FCFA`
                      : `${p.price_min?.toLocaleString()} – ${p.price_max?.toLocaleString()} FCFA`}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => openEdit(p)} className="flex-1 py-2 text-xs font-medium border border-[#e5eaf0] rounded-lg text-[#1a2942] hover:bg-[#f0f4f8] transition-colors">
                      Modifier
                    </button>
                    <button onClick={async () => { if (confirm('Supprimer ?')) { await fetch(`/api/dashboard/products?id=${p.id}`, { method: 'DELETE' }); loadProducts(); }}}
                      className="flex-1 py-2 text-xs font-medium border border-[#fdecea] rounded-lg text-[#c0392b] bg-[#fdecea] hover:bg-[#fcc] transition-colors">
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
        <div className="fixed inset-0 bg-[#1a2942]/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#e5eaf0]">
              <h2 className="text-base font-bold text-[#1a2942]">
                {editing ? 'Modifier l\'article' : 'Ajouter un article'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[#8899bb] hover:text-[#1a2942] text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { label: 'Nom de l\'article *', key: 'name', placeholder: 'Ex: Robe de soirée' },
                { label: 'Catégorie', key: 'category', placeholder: 'Ex: Robes, Jeans...' },
                { label: 'Description', key: 'description', placeholder: 'Description optionnelle' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#1a2942] mb-1.5">{label}</label>
                  <input type="text" placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-[#e5eaf0] rounded-lg text-sm text-[#1a2942] outline-none focus:border-[#25D366] transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-[#1a2942] mb-2">Prix</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Prix fixe', key: 'price_fixed', placeholder: '15000' },
                    { label: 'Prix min', key: 'price_min', placeholder: '8000' },
                    { label: 'Prix max', key: 'price_max', placeholder: '15000' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-[10px] text-[#8899bb] mb-1 block">{label} (FCFA)</label>
                      <input type="number" placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-2.5 py-2 border border-[#e5eaf0] rounded-lg text-xs text-[#1a2942] outline-none focus:border-[#25D366]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a2942] mb-1.5">Photo (optionnelle)</label>
                <input type="file" accept="image/*" onChange={handleUpload} className="text-xs text-[#1a2942] w-full"/>
                {uploading && <div className="text-xs text-[#25D366] mt-1">Upload en cours...</div>}
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="w-full h-36 object-cover rounded-lg mt-2"/>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.available}
                  onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
                  className="w-4 h-4 accent-[#25D366]"
                />
                <span className="text-sm text-[#1a2942]">Article disponible</span>
              </label>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-[#e5eaf0] rounded-lg text-sm text-[#1a2942] font-medium hover:bg-[#f0f4f8]">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving || !form.name}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${saving || !form.name ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#1db954]'}`}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}