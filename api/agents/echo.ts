export const config = { runtime: 'nodejs' };

const GATEWAY = process.env.GATEWAY_URL ?? "https://agent-gateway-112329442315.europe-west1.run.app";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response('{"error":"Use POST"}', { status:405, headers:{'content-type':'application/json'}});
  const payload = await req.json().catch(() => ({}));
  const gw = await fetch(`${GATEWAY}/agents/echo`, {
    method: "POST",
    headers: { "content-type": "application/json", "accept": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await gw.text();
  return new Response(body, { status: gw.status, headers: { "content-type": gw.headers.get("content-type") ?? "application/json" } });
}
