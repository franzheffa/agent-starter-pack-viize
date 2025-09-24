// ESM TS route: /api/agents/<agent> -> Gateway Cloud Run
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FALLBACK = "https://agent-smith-heffa-112329442315.us-central1.run.app";
const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.GATEWAY_URL ||
  FALLBACK;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!BASE) {
    res.status(500).json({ error: "Missing GATEWAY_URL/NEXT_PUBLIC_API_BASE_URL" });
    return;
  }
  const seg = req.query.agent!;
  const path = Array.isArray(seg) ? seg.join("/") : seg;
  const url = `${BASE.replace(/\/$/, "")}/agents/${path}`;

  try {
    const method = (req.method || "POST").toUpperCase();
    const headers: Record<string, string> = {};

    // On ne copie que l'en-tête content-type, c'est plus sûr.
    const ct = req.headers["content-type"];
    if (typeof ct === "string") {
      headers["Content-Type"] = ct;
    }

    let body: BodyInit | null = null;

    // On ne traite le corps que si la méthode le permet et s'il existe.
    if (!["GET", "HEAD"].includes(method) && req.body) {
        // Si le corps est un objet (comme un JSON), on le transforme en chaîne de caractères
        // et on s'assure que l'en-tête est correct.
        if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
            body = JSON.stringify(req.body);
            headers['Content-Type'] = 'application/json';
        } else {
            // Sinon (si c'est déjà du texte ou autre), on le passe directement.
            body = req.body;
        }
    }

    // On envoie la requête avec les bons paramètres.
    const r = await fetch(url, { method, headers, body });

    const rct = r.headers.get("content-type") || "";
    const buf = Buffer.from(await r.arrayBuffer());
    res.status(r.status);
    if (rct) res.setHeader("content-type", rct);
    res.send(buf);
  } catch (e: any) {
    res.status(502).json({ error: "Gateway fetch failed", message: e?.message ?? String(e) });
  }
}
