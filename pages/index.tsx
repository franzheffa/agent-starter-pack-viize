import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>Buttertech | AI Agent Infrastructure</title>
      </Head>
      <nav style={{ padding: '2rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>BUTTERTECH</span>
        <span style={{ color: '#4285F4' }}>● Google for Startup Instance</span>
      </nav>
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #4285F4, #34A853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Next-Gen AI Orchestration
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Infrastructure sécurisée pour agents autonomes déployée sur Vercel Edge et Google Cloud Run.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #222', borderRadius: '12px', background: '#0a0a0a' }}>
            <h3 style={{ color: '#FBBC05' }}>NVIDIA Inception</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Optimisation GPU via VSC.</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #222', borderRadius: '12px', background: '#0a0a0a' }}>
            <h3 style={{ color: '#4285F4' }}>Google Cloud</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Orchestration GKE & Cloud Run.</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #222', borderRadius: '12px', background: '#0a0a0a' }}>
            <h3 style={{ color: '#34A853' }}>Prisma Data</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>PostgreSQL Edge-Ready.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
