import React, { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [status, setStatus] = useState("Vérification...");

  const checkAgent = async () => {
    try {
      const res = await fetch('/api/agents/gemini');
      const data = await res.json();
      setStatus(`Agent ${data.agent} : ${data.status}`);
    } catch (e) { setStatus("Agent Offline"); }
  }

  return (
    <div style={{ backgroundColor: '#FFF', color: '#000', minHeight: '100vh', padding: '40px', fontFamily: 'serif' }}>
      <Head><title>BUTTERTECH | IA</title></Head>
      
      <header style={{ borderBottom: '1px solid #000', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: '900', letterSpacing: '2px', fontSize: '1.2rem' }}>BUTTERTECH</span>
        <span style={{ color: '#D4AF37', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px' }}>Validation Program 2026</span>
      </header>

      <main style={{ marginTop: '15vh' }}>
        <h1 style={{ fontSize: '5rem', margin: '0', fontWeight: '400', lineHeight: '0.9' }}>Smith-Heffa<br/><span style={{ color: '#D4AF37' }}>Intelligence.</span></h1>
        
        <div style={{ marginTop: '60px', maxWidth: '500px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333' }}>
            L'orchestration de modèles génératifs sur infrastructure NVIDIA. 
            Conçu pour l'excellence, déployé pour Google Cloud.
          </p>
          
          <button 
            onClick={checkAgent}
            style={{ 
              marginTop: '40px', padding: '15px 40px', background: '#000', color: '#D4AF37', 
              border: '1px solid #D4AF37', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '2px' 
            }}>
            INTERROGER L'AGENT GEMINI
          </button>
          
          <div style={{ marginTop: '20px', fontFamily: 'monospace', fontSize: '0.7rem', color: '#999' }}>
            STATUS_LOG: {status}
          </div>
        </div>
      </main>

      <footer style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EEE', paddingTop: '20px' }}>
        <span style={{ fontSize: '0.7rem' }}>NVIDIA INCEPTION</span>
        <span style={{ fontSize: '0.7rem' }}>GOOGLE FOR STARTUP</span>
      </footer>
    </div>
  )
}
