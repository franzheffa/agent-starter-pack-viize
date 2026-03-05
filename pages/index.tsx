import React from 'react'
import Head from 'next/head'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>Buttertech AI | Premium Intelligence</title>
      </Head>
      
      <nav style={{ padding: '2rem', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-1px' }}>
          BUTTER<span style={{ color: '#D4AF37' }}>TECH</span>
        </div>
        <div style={{ color: '#D4AF37', fontWeight: '500' }}>Inception NVIDIA Program</div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          L'intelligence artificielle <br/> 
          <span style={{ color: '#D4AF37' }}>version haute couture.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '3rem' }}>
          Validation Google for Startup — Infrastructure Edge & Gemini Pro.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          <div style={{ padding: '2rem', border: '1px solid #D4AF37', borderRadius: '4px', background: '#FFFFFF' }}>
            <h3 style={{ marginBottom: '10px' }}>Agent Gemini</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Connecté via Vertex AI & Google Cloud.</p>
            <a href="/api/agents/gemini" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>VÉRIFIER LE STATUT →</a>
          </div>
          
          <div style={{ padding: '2rem', border: '1px solid #000', borderRadius: '4px', background: '#000', color: '#FFF' }}>
            <h3 style={{ marginBottom: '10px', color: '#D4AF37' }}>NVIDIA Inception</h3>
            <p style={{ fontSize: '0.9rem', color: '#CCC' }}>Accélération compute GPU & VSC.</p>
          </div>
        </div>
      </main>

      <footer style={{ position: 'fixed', bottom: '2rem', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: '#999' }}>
        © 2026 BUTTERTECH.IO | SECURE DEPLOYMENT
      </footer>
    </div>
  )
}
