export const config = { runtime: 'nodejs' };

const GATEWAY = process.env.GATEWAY_URL ?? "https://agent-gateway-112329442315.europe-west1.run.app";

export default async function handler(): Promise<Response> {
  try {
    const r = await fetch(`${GATEWAY}/health`, { headers: { accept: "application/json" } });
    const txt = await r.text();
    return new Response(txt, { status: r.ok ? 200 : r.status, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, error:String(e), gateway:GATEWAY }), {
      status: 500, headers: { "content-type":"application/json" }
    });
  }
}
