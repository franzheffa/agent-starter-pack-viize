// api/agent.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";

const FALLBACK = "https://agent-gateway-112329442315.europe-west1.run.app";
const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.GATEWAY_URL ||
  FALLBACK;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!BASE) {
    res.status(500).json({ error: "Missing GATEWAY_URL/NEXT_PUBLIC_API_BASE_URL" });
    return;
  }

  const url = `${BASE.replace(/\/$/, "")}/agents/echo`;

  try {
    const method = (req.method || "POST").toUpperCase();
    const headers: Record<string, string> = {};
    const ct = req.headers["content-type"];
    if (typeof ct === "string") headers["content-type"] = ct;

    const init: RequestInit = { method, headers } as any;

    if (!["GET", "HEAD"].includes(method)) {
      init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    }

    const r = await fetch(url, init);
    const rct = r.headers.get("content-type") || "";
    const buf = Buffer.from(await r.arrayBuffer());

    res.status(r.status);
    if (rct) res.setHeader("content-type", rct);
    res.send(buf);

  } catch (e: any) {
    res.status(502).json({ error: "Gateway fetch failed", message: e?.message ?? String(e) });
  }
}
