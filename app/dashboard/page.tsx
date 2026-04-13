'use client';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        Dashboard ChatBotLocal
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Gérez votre bot WhatsApp depuis cette interface
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        <Link href="/dashboard/conversations" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
              Conversations
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Voir tous les messages des clients en temps réel
            </p>
          </div>
        </Link>

        <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛍️</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
              Catalogue produits
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Ajouter, modifier ou supprimer vos articles
            </p>
          </div>
        </Link>

        <Link href="/dashboard/config" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
              Configuration du bot
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Modifier le prompt, les horaires, la localisation
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}