import Head from "next/head";
import Link from "next/link";

export default function EquipePage() {
  return (
    <>
      <Head>
        <title>Équipe — Buttertech</title>
        <meta name="description" content="Équipe Buttertech — Viize Vision & Agent Smith-Heffa" />
      </Head>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-block", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 999 }}>
              Buttertech
            </div>
            <h1 style={{ margin: "10px 0 0" }}>Équipe</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.7 }}>
              Produit • Vision AI • Orchestration d’agents • Déploiement
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/">← Feed</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 20, border: "1px solid #e5e7eb", borderRadius: 16 }}>
          <h2 style={{ marginTop: 0 }}>Core</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
              <div style={{ fontWeight: 900 }}>Franz Heffa</div>
              <div style={{ opacity: 0.7 }}>Founder • Fullstack • Vision AI</div>
              <div style={{ marginTop: 10, opacity: 0.7 }}>
                Stack: Next.js • Prisma • Vercel • Google Cloud • NVIDIA
              </div>
            </div>

            <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
              <div style={{ fontWeight: 900 }}>Agent Smith-Heffa</div>
              <div style={{ opacity: 0.7 }}>Orchestrateur multimodal • Ops & IA</div>
              <div style={{ marginTop: 10, opacity: 0.7 }}>
                Automatisation: contenu, flux, actions, intégrations
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "16px 0" }} />

          <p style={{ margin: 0, opacity: 0.7 }}>
            GitHub :{" "}
            <a href="https://github.com/franzheffa" target="_blank" rel="noreferrer">
              github.com/franzheffa
            </a>
          </p>
        </div>

        <footer style={{ marginTop: 18, opacity: 0.7 }}>
          © {new Date().getFullYear()} Buttertech
        </footer>
      </main>
    </>
  );
}
