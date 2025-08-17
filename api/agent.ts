import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.GATEWAY_URL ||
  "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!BASE) {
    res.status(500).json({ error: "Missing GATEWAY_URL/NEXT_PUBLIC_API_BASE_URL" });
    return;
  }
  const url = `${BASE.replace(/\/$/, "")}/agents/echo`;

  try {
    const method = (req.method || "POST").toUpperCase();
    const headers: Record<string, string> = {};
    if (typeof req.headers["content-type"] === "string")
      headers["content-type"] = req.headers["content-type"] as string;

    const init: RequestInit = { method, headers } as any;
    if (!["GET","HEAD"].includes(method)) {
      init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    }

    const r = await fetch(url, init);
    const ct = r.headers.get("content-type") || "";
    const buf = Buffer.from(await r.arrayBuffer());
    res.status(r.status);
    if (ct) res.setHeader("content-type", ct);
    res.send(buf);
  } catch (e:any) {
    res.status(502).json({ error: "Gateway fetch failed", message: e?.message ?? String(e) });
  }
}
