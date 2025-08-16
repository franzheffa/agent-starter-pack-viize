export const config = { runtime: 'nodejs' };

const GATEWAY = process.env.GATEWAY_URL ?? "https://agent-gateway-112329442315.europe-west1.run.app";

type In = { prompt?: string; imageUrl?: string; model?: string; stream?: boolean; speak?: boolean };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response('{"error":"Use POST"}', { status:405, headers:{'content-type':'application/json'}});
  }
  const { prompt, imageUrl, model, stream, speak } = await req.json().catch(() => ({} as In));

  // Proxy vers la gateway (SSE si stream=true)
  const url = new URL("/agents/gemini", GATEWAY);
  if (stream) url.searchParams.set("stream", "1");
  if (speak)  url.searchParams.set("speak", "1");

  const gw = await fetch(String(url), {
    method: "POST",
    headers: { "content-type": "application/json", "accept": stream ? "text/event-stream" : "application/json" },
    body: JSON.stringify({ prompt, imageUrl, model }),
  });

  if (stream) {
    const hdrs = new Headers(gw.headers);
    hdrs.set("cache-control", "no-store");
    hdrs.set("content-type", "text/event-stream; charset=utf-8");
    return new Response(gw.body, { status: gw.status, headers: hdrs });
  } else {
    const body = await gw.text();
    return new Response(body, { status: gw.status, headers: { "content-type": gw.headers.get("content-type") ?? "application/json" } });
  }
}
