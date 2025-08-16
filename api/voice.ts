export const config = { runtime: 'nodejs' };

const GATEWAY = process.env.GATEWAY_URL ?? "https://agent-gateway-112329442315.europe-west1.run.app";

export default async function handler(req: Request): Promise<Response> {
  const u = new URL(req.url);
  const text = u.searchParams.get("text") ?? "Bonjour";
  const gw = await fetch(`${GATEWAY}/voice?text=${encodeURIComponent(text)}`);
  const h = new Headers(gw.headers);
  h.set("content-disposition", 'inline; filename="voice.mp3"');
  h.set("cache-control", "no-store");
  return new Response(gw.body, { status: gw.status, headers: h });
}
