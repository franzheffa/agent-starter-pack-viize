import Head from "next/head";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact — Buttertech</title>
        <meta name="description" content="Contact Buttertech — Viize Vision & Agent Smith-Heffa" />
      </Head>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-block", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 999 }}>
              Buttertech
            </div>
            <h1 style={{ margin: "10px 0 0" }}>Contact</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.7 }}>
              Pilote parking • Intégration • Partenariats • Déploiement
            </p>
          </div>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              ← Retour au Feed
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 20, border: "1px solid #e5e7eb", borderRadius: 16 }}>
          <p style={{ marginTop: 0 }}>
            Décris ton besoin. On te répond avec une proposition de pilote (scope + délai + pricing).
          </p>

          <form
            method="post"
            action="mailto:contact@buttertech.io"
            encType="text/plain"
            style={{ display: "grid", gap: 10 }}
          >
            <label>
              Nom
              <input name="name" placeholder="Ton nom" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
            </label>

            <label>
              Email
              <input name="email" placeholder="ton@email.com" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
            </label>

            <label>
              Message
              <textarea name="msg" rows={6} placeholder="Décris ton besoin (parking, caméras, agents IA, paiement, etc.)"
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </label>

            <button type="submit" style={{ padding: "12px 14px", borderRadius: 12, border: 0, fontWeight: 800, cursor: "pointer" }}>
              Envoyer
            </button>

            <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>
              (Option pro) Si tu veux un vrai formulaire backend (API route + stockage), je te le branche ensuite proprement.
            </p>
          </form>
        </div>

        <footer style={{ marginTop: 18, opacity: 0.7 }}>
          © {new Date().getFullYear()} Buttertech • <Link href="/equipe">Équipe</Link>
        </footer>
      </main>
    </>
  );
}
