export const runtime = 'nodejs' as const;
export const dynamic = 'force-dynamic';
export const preferredRegion = ['iad1','cdg1','fra1']; // proche US-East/Europe

export function gw() {
  return process.env.GATEWAY_URL || process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://agent-gateway-112329442315.europe-west1.run.app';
}

export async function passThrough(up: Response): Promise<Response> {
  // Copie le status + quelques headers essentiels et garde le stream
  const headers = new Headers();
  const ct = up.headers.get('content-type') ?? 'text/plain';
  headers.set('content-type', ct);
  const disp = up.headers.get('content-disposition'); if (disp) headers.set('content-disposition', disp);
  const cache = up.headers.get('cache-control');       if (cache) headers.set('cache-control', cache);
  return new Response(up.body, { status: up.status, headers });
}

export async function methodGuard(req: Request, allow: ('GET'|'POST')[]) {
  if (!allow.includes(req.method as any)) {
    return new Response(`Méthode ${req.method} non autorisée`, { status: 405 });
  }
  return null;
}
