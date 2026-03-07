import { useState, useEffect, useRef } from 'react';

const agents = [
  {
    id: 'viize',
    code: 'VIIZE-01',
    name: 'Viize Vision Parking',
    tagline: 'Intelligence spatiale urbaine',
    description: 'Détection temps réel des places de stationnement à Montréal. Tarification dynamique par IA. Réservation instantanée.',
    url: 'https://viize-vision-parking.vercel.app',
    status: 'OPÉRATIONNEL',
    metrics: [{ label: 'Places actives', value: '847' }, { label: 'Précision IA', value: '98.4%' }, { label: 'Demande IA', value: '×1.46' }],
    color: '#4F6EF7',
    accent: '#7B93FF',
    featured: true,
    sector: 'MOBILITÉ URBAINE',
    tech: ['NVIDIA DeepStream', 'Gemini Vision', 'Edge Computing'],
  },
  {
    id: 'finance',
    code: 'FIXAPI-02',
    name: 'Finance FixAPI',
    tagline: 'Orchestration des flux financiers',
    description: 'Agrégation multi-assets. Stripe, PayPal, Apple Pay, MTN Mobile Money. Reporting unifié en temps réel.',
    url: 'https://finance-fixapi-master.vercel.app',
    status: 'ACTIF',
    metrics: [{ label: 'Valeur globale', value: '$2,540' }, { label: 'Devises', value: '12' }, { label: 'Intégrations', value: '6' }],
    color: '#F0A500',
    accent: '#FFD166',
    featured: false,
    sector: 'FINTECH',
    tech: ['Stripe API', 'Interac', 'Africa Mobile Money'],
  },
  {
    id: 'academy',
    code: 'ACAD-03',
    name: 'Buttertech Academy',
    tagline: "L'IA certifiée. Réglementée.",
    description: "Formation IA souveraine certifiée SOFEDUC. Conformité Loi 25 & RGPD. Partenaire Google for Education & NVIDIA Inception.",
    url: 'https://buttertech-academy.vercel.app',
    status: 'ACTIF',
    metrics: [{ label: 'Certification', value: 'SOFEDUC' }, { label: 'Conformité', value: 'LOI 25' }, { label: 'Partenaires', value: '2' }],
    color: '#0ABFBC',
    accent: '#4DEEEA',
    featured: false,
    sector: 'EDTECH',
    tech: ['Google for Education', 'NVIDIA Inception', 'RGPD'],
  },
  {
    id: 'med',
    code: 'MEDG-04',
    name: 'Med-Gemma Foundry',
    tagline: 'Vision augmentée & raisonnement multimodal',
    description: "Intelligence territoriale clinique. Orchestration des flux médicaux et urbains. Propulsé par Gemini 2.5 Flash.",
    url: 'https://med-gemma-foundry-smith-heffa.vercel.app',
    status: 'OPÉRATIONNEL',
    metrics: [{ label: 'Réactivité', value: '+98%' }, { label: 'Économie', value: '-35%' }, { label: 'Modèle', value: 'Gemini 2.5' }],
    color: '#7C3AED',
    accent: '#A78BFA',
    featured: false,
    sector: 'MEDTECH',
    tech: ['MedGemma', 'BioNeMo', 'NVIDIA Triton'],
  },
  {
    id: 'sovereign',
    code: 'SOVR-05',
    name: 'Sovereign Orchestrator',
    tagline: 'Détection fraude & cybersécurité souveraine',
    description: 'Analyse GNN temps réel. Model Armor guardrails. Threat Intelligence Mandiant. Fraud Score 0.96.',
    url: 'https://smith-heffa-sovereign-orchestrator.vercel.app',
    status: 'OPÉRATIONNEL',
    metrics: [{ label: 'Fraud Score', value: '0.96' }, { label: 'Risque', value: 'CRITIQUE' }, { label: 'Latence', value: '<50ms' }],
    color: '#EF4444',
    accent: '#FCA5A5',
    featured: false,
    sector: 'CYBERSÉCURITÉ',
    tech: ['NVIDIA GNN', 'Mandiant TI', 'Google SCC'],
  },
];

export default function Home() {
  const [activeAgent, setActiveAgent] = useState(0);
  const [tick, setTick] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const featured = agents[0];
  const secondaries = agents.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #050505;
          --white: #F5F2EB;
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --surface: #0D0D0D;
          --border: rgba(255,255,255,0.07);
          --text-dim: rgba(245,242,235,0.45);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'DM Mono', monospace;
          overflow-x: hidden;
          cursor: none;
        }

        .cursor {
          position: fixed;
          width: 8px; height: 8px;
          background: var(--gold);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s ease;
          mix-blend-mode: difference;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid var(--border);
          background: rgba(5,5,5,0.85);
          backdrop-filter: blur(20px);
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.15em;
          color: var(--white);
          text-decoration: none;
        }
        .nav-logo span { color: var(--gold); }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 2rem;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          color: var(--text-dim);
        }
        .nav-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4ade80;
        }
        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 3rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 70% 40%, rgba(79,110,247,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 50%);
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%);
        }
        .hero-eyebrow {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: var(--gold);
          margin-bottom: 1.5rem;
          position: relative;
        }
        .hero-title {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: clamp(3.5rem, 8vw, 7rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          position: relative;
          max-width: 900px;
        }
        .hero-title em {
          font-style: italic;
          font-weight: 300;
          color: var(--gold);
        }
        .hero-sub {
          margin-top: 2rem;
          font-size: 0.75rem;
          color: var(--text-dim);
          max-width: 420px;
          line-height: 1.8;
          position: relative;
        }
        .hero-cta {
          margin-top: 2.5rem;
          display: flex;
          gap: 1rem;
          position: relative;
        }
        .btn-primary {
          background: var(--gold);
          color: var(--black);
          border: none;
          padding: 0.85rem 2rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          cursor: none;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
        .btn-ghost {
          background: transparent;
          color: var(--white);
          border: 1px solid var(--border);
          padding: 0.85rem 2rem;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          cursor: none;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

        .hero-scroll {
          position: absolute;
          bottom: 3rem;
          right: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: scrollDown 2s ease-in-out infinite;
        }
        @keyframes scrollDown {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* FEATURED AGENT */
        .section { padding: 6rem 3rem; }
        .section-label {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: var(--gold);
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .section-label::after {
          content: '';
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: var(--gold);
          opacity: 0.3;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .featured-info {
          padding: 3rem;
          background: var(--surface);
        }
        .featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(79,110,247,0.15);
          border: 1px solid rgba(79,110,247,0.3);
          color: #7B93FF;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          padding: 0.4rem 0.8rem;
          margin-bottom: 2rem;
        }
        .featured-code {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          margin-bottom: 0.75rem;
        }
        .featured-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2.2rem;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .featured-tagline {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1rem;
          color: #7B93FF;
          margin-bottom: 1.5rem;
        }
        .featured-desc {
          font-size: 0.7rem;
          color: var(--text-dim);
          line-height: 1.9;
          margin-bottom: 2rem;
        }
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .tech-tag {
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          border: 1px solid var(--border);
          padding: 0.3rem 0.6rem;
          color: var(--text-dim);
        }
        .featured-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-bottom: 2rem;
        }
        .metric {
          background: var(--black);
          padding: 1rem;
        }
        .metric-value {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: #7B93FF;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .metric-label {
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          color: var(--text-dim);
        }

        /* LIVE PREVIEW PANEL */
        .featured-preview {
          background: #070712;
          position: relative;
          overflow: hidden;
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }
        .preview-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: var(--text-dim);
        }
        .preview-dots { display: flex; gap: 0.4rem; }
        .pdot { width: 8px; height: 8px; border-radius: 50%; }

        .parking-grid {
          flex: 1;
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .parking-spot {
          border: 1px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          transition: all 0.4s ease;
        }
        .spot-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .spot-free { border-color: rgba(74,222,128,0.4); color: #4ade80; background: rgba(74,222,128,0.05); }
        .spot-taken { border-color: rgba(239,68,68,0.3); color: rgba(239,68,68,0.6); background: rgba(239,68,68,0.04); }
        .spot-ev { border-color: rgba(79,110,247,0.4); color: #4F6EF7; background: rgba(79,110,247,0.06); }

        .preview-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.6rem;
          color: var(--text-dim);
        }
        .ai-demand {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: var(--gold);
        }

        /* AGENTS GRID */
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .agent-card {
          background: var(--surface);
          padding: 2.5rem;
          text-decoration: none;
          color: inherit;
          transition: background 0.3s;
          display: block;
          position: relative;
          overflow: hidden;
        }
        .agent-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-color, var(--gold));
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .agent-card:hover { background: #111; }
        .agent-card:hover::before { transform: scaleX(1); }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .card-sector {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          padding: 0.3rem 0.6rem;
          border: 1px solid var(--border);
          color: var(--text-dim);
        }
        .card-status {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s infinite;
        }
        .card-code {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          margin-bottom: 0.5rem;
        }
        .card-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }
        .card-tagline {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }
        .card-desc {
          font-size: 0.65rem;
          color: var(--text-dim);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .card-metrics {
          display: flex;
          gap: 1.5rem;
        }
        .cm { }
        .cm-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          line-height: 1;
        }
        .cm-label {
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          margin-top: 0.2rem;
        }
        .card-arrow {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          font-size: 1.2rem;
          color: var(--text-dim);
          transition: transform 0.3s, color 0.3s;
        }
        .agent-card:hover .card-arrow { transform: translate(4px, -4px); color: var(--gold); }

        /* MANIFESTO */
        .manifesto {
          padding: 8rem 3rem;
          border-top: 1px solid var(--border);
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          align-items: start;
        }
        .manifesto-label {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: var(--gold);
          position: sticky;
          top: 6rem;
        }
        .manifesto-text {
          font-family: 'Fraunces', serif;
          font-weight: 300;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          line-height: 1.4;
          color: var(--white);
        }
        .manifesto-text em {
          font-style: italic;
          color: var(--gold);
        }
        .manifesto-text strong {
          font-weight: 700;
        }

        /* PARTNERS */
        .partners {
          padding: 3rem;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .partner-label {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .partner-logos {
          display: flex;
          gap: 3rem;
          align-items: center;
        }
        .partner-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          transition: color 0.2s;
        }
        .partner-logo:hover { color: var(--white); }

        /* FOOTER */
        footer {
          padding: 2rem 3rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.6rem;
          color: var(--text-dim);
          letter-spacing: 0.1em;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.8rem;
          color: var(--white);
        }
        .footer-logo span { color: var(--gold); }

        /* TICKER */
        .ticker {
          background: var(--gold);
          color: var(--black);
          overflow: hidden;
          white-space: nowrap;
          padding: 0.5rem 0;
        }
        .ticker-inner {
          display: inline-flex;
          gap: 0;
          animation: ticker 20s linear infinite;
        }
        .ticker-item {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          padding: 0 2rem;
        }
        .ticker-sep { opacity: 0.4; }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (max-width: 768px) {
          nav { padding: 1rem 1.5rem; }
          .hero { padding: 0 1.5rem 3rem; }
          .section { padding: 4rem 1.5rem; }
          .featured-grid { grid-template-columns: 1fr; }
          .agents-grid { grid-template-columns: 1fr; }
          .manifesto { grid-template-columns: 1fr; gap: 2rem; }
          .partners { flex-direction: column; gap: 1.5rem; }
          footer { flex-direction: column; gap: 1rem; text-align: center; }
          .hero-scroll { display: none; }
        }
      `}</style>

      {/* CURSOR */}
      <CursorDot />

      {/* NAV */}
      <nav>
        <span className="nav-logo">BUTTER<span>TECH</span></span>
        <div className="nav-right">
          <span>VALIDATION PROGRAM 2026</span>
          <span className="nav-status">
            <span className="dot" />
            AGENT SMITH-HEFFA EN LIGNE
          </span>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker" style={{ marginTop: '64px' }}>
        <div className="ticker-inner">
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: 'flex' }}>
              <span className="ticker-item">NVIDIA INCEPTION</span>
              <span className="ticker-item ticker-sep">×</span>
              <span className="ticker-item">GOOGLE FOR STARTUP</span>
              <span className="ticker-item ticker-sep">×</span>
              <span className="ticker-item">BUTTERTECH · SMITH-HEFFA INTELLIGENCE</span>
              <span className="ticker-item ticker-sep">×</span>
              <span className="ticker-item">5 AGENTS IA DÉPLOYÉS EN PRODUCTION</span>
              <span className="ticker-item ticker-sep">×</span>
              <span className="ticker-item">VALIDATION PROGRAM 2026</span>
              <span className="ticker-item ticker-sep">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-eyebrow">BUTTERTECH — PLATEFORME D'AGENTS IA SOUVERAINS</div>
        <h1 className="hero-title">
          Smith-Heffa<br />
          <em>Intelligence.</em>
        </h1>
        <p className="hero-sub">
          L'orchestration de modèles génératifs sur infrastructure NVIDIA.<br />
          Conçu pour l'excellence, déployé pour Google Cloud.
        </p>
        <div className="hero-cta">
          <a href="#agents" className="btn-primary">EXPLORER LES AGENTS</a>
          <a href="https://viize-vision-parking.vercel.app" target="_blank" rel="noopener" className="btn-ghost">VIIZE LIVE →</a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>SCROLL</span>
        </div>
      </div>

      {/* FEATURED AGENT — VIIZE */}
      <section className="section" id="agents">
        <div className="section-label">AGENT VEDETTE — MOBILITÉ URBAINE</div>
        <div className="featured-grid">
          <div className="featured-info">
            <div className="featured-badge">
              <span className="dot" style={{ background: '#4F6EF7' }} />
              AGENT OPÉRATIONNEL
            </div>
            <div className="featured-code">{featured.code}</div>
            <h2 className="featured-name">{featured.name}</h2>
            <p className="featured-tagline">{featured.tagline}</p>
            <p className="featured-desc">{featured.description}</p>
            <div className="tech-tags">
              {featured.tech.map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="featured-metrics">
              {featured.metrics.map(m => (
                <div key={m.label} className="metric">
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
            <a href={featured.url} target="_blank" rel="noopener" className="btn-primary">
              ACCÉDER À VIIZE →
            </a>
          </div>

          {/* LIVE PARKING PREVIEW */}
          <div className="featured-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <div className="pdot" style={{ background: '#ef4444' }} />
                <div className="pdot" style={{ background: '#f59e0b' }} />
                <div className="pdot" style={{ background: '#4ade80' }} />
              </div>
              <span>VIIZE · MONTRÉAL TEMPS RÉEL</span>
              <span className="dot" />
            </div>
            <LiveParkingGrid tick={tick} />
            <div className="preview-footer">
              <span>847 PLACES SURVEILLÉES</span>
              <span>DEMANDE IA: <span className="ai-demand">×1.46</span></span>
              <span>PRÉCISION: 98.4%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ALL AGENTS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-label">FLOTTE D'AGENTS — USE CASES SMITH-HEFFA</div>
        <div className="agents-grid">
          {secondaries.map((agent) => (
            <a
              key={agent.id}
              href={agent.url}
              target="_blank"
              rel="noopener"
              className="agent-card"
              style={{ '--card-color': agent.color } as React.CSSProperties}
            >
              <div className="card-top">
                <span className="card-sector">{agent.sector}</span>
                <span className="card-status" style={{ color: '#4ade80' }}>
                  <span className="status-dot" />
                  {agent.status}
                </span>
              </div>
              <div className="card-code">{agent.code}</div>
              <h3 className="card-name" style={{ color: agent.accent }}>{agent.name}</h3>
              <p className="card-tagline" style={{ color: agent.color }}>{agent.tagline}</p>
              <p className="card-desc">{agent.description}</p>
              <div className="card-metrics">
                {agent.metrics.slice(0, 2).map(m => (
                  <div key={m.label} className="cm">
                    <div className="cm-val" style={{ color: agent.accent }}>{m.value}</div>
                    <div className="cm-label">{m.label}</div>
                  </div>
                ))}
              </div>
              <span className="card-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <div className="manifesto">
        <div className="manifesto-label">MANIFESTE</div>
        <p className="manifesto-text">
          Nous ne construisons pas des <em>outils</em>.<br />
          Nous déployons des <strong>agents souverains</strong><br />
          capables de <em>percevoir, décider, agir</em>.<br /><br />
          Sur infrastructure NVIDIA.<br />
          Orchestrés par Google Cloud.<br />
          <em>Validés pour le monde réel.</em>
        </p>
      </div>

      {/* PARTNERS */}
      <div className="partners">
        <span className="partner-label">PARTENAIRES INSTITUTIONNELS</span>
        <div className="partner-logos">
          <span className="partner-logo">NVIDIA INCEPTION</span>
          <span className="partner-logo">GOOGLE FOR STARTUP</span>
          <span className="partner-logo">SOFEDUC</span>
          <span className="partner-logo">INTERAC</span>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">BUTTER<span>TECH</span></span>
        <span>STATUS_LOG: Agent SMITH-HEFFA : EN LIGNE</span>
        <span>© 2026 BUTTERTECH INC. — MONTRÉAL</span>
      </footer>
    </>
  );
}

function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX - 4 + 'px';
        ref.current.style.top = e.clientY - 4 + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} className="cursor" />;
}

const SPOTS = [
  { id: '01', base: 'free' },
  { id: '02', base: 'taken' },
  { id: '03', base: 'free' },
  { id: '04', base: 'ev' },
  { id: '05', base: 'free' },
  { id: '06', base: 'taken' },
  { id: '07', base: 'free' },
  { id: '08', base: 'ev' },
  { id: '09', base: 'taken' },
  { id: '10', base: 'free' },
  { id: '11', base: 'free' },
  { id: '12', base: 'taken' },
];

function LiveParkingGrid({ tick }: { tick: number }) {
  const [states, setStates] = useState(SPOTS.map(s => s.base));

  useEffect(() => {
    setStates(prev => prev.map((s, i) => {
      if (Math.random() > 0.82) {
        if (s === 'free') return 'taken';
        if (s === 'taken') return 'free';
      }
      return s;
    }));
  }, [tick]);

  return (
    <div className="parking-grid">
      {SPOTS.map((spot, i) => (
        <div key={spot.id} className={`parking-spot spot-${states[i]}`}>
          <div className="spot-num">#{spot.id}</div>
          <div>{states[i] === 'free' ? 'LIBRE' : states[i] === 'ev' ? 'EV' : 'OCCUPÉ'}</div>
        </div>
      ))}
    </div>
  );
}
