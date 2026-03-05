import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.5', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Head>
        <title>Buttertech | AI Agent Platform</title>
        <meta name="description" content="Production environment for Google for Startup validation" />
      </Head>
      <header>
        <h1 style={{ color: '#0070f3' }}>Agent Gateway v1.0</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Statut : <strong>Production Ready</strong></p>
      </header>
      <main style={{ marginTop: '3rem', borderTop: '1px solid #eaeaea', paddingTop: '2rem' }}>
        <h2>Core Modules</h2>
        <ul>
          <li><strong>AI Gateway:</strong> <code style={{ background: '#fafafa', padding: '0.2rem' }}>/api/agents/[agent]</code></li>
          <li><strong>Agent Studio:</strong> Connecté via NVIDIA VSC</li>
          <li><strong>Database:</strong> Prisma + PostgreSQL (Cloud Run)</li>
        </ul>
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f7ff', borderRadius: '8px' }}>
          <p>ℹ️ Cette instance est configurée pour la validation Google Cloud.</p>
        </div>
      </main>
    </div>
  );
}
