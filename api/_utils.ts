export const runtime = 'edge';
export const dynamic = 'force-dynamic';
// On choisit une région proche de votre passerelle pour minimiser la latence.
export const preferredRegion = ['fra1']; // France (Paris)

/**
 * Retourne l'URL de base de la passerelle (Gateway) de manière sécurisée.
 */
export function gw(): string {
  const url = process.env.GATEWAY_URL || process.env.NEXT_PUBLIC_GATEWAY_URL;
  if (!url) {
    // Si l'URL n'est pas définie, on lance une erreur claire au lieu de continuer avec une valeur par défaut.
    throw new Error("La variable d'environnement GATEWAY_URL n'est pas définie.");
  }
  return url.replace(/\/$/, ""); // Enlève le slash final pour éviter les doubles slashes.
}

/**
 * Transfère la réponse de la passerelle au client de manière transparente.
 * C'est une méthode plus robuste et complète que la précédente.
 */
export function passThrough(response: Response): Response {
  // On crée de nouveaux headers pour pouvoir les modifier sans affecter l'original.
  const headers = new Headers(response.headers);
  // Cette ligne est cruciale pour que le code côté client (navigateur) puisse lire les headers de la réponse.
  headers.set('Access-Control-Expose-Headers', '*');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Bloque les requêtes qui n'utilisent pas une des méthodes HTTP autorisées (GET, POST, etc.).
 */
export async function methodGuard(req: Request, allow: string[]): Promise<Response | null> {
  if (!allow.includes(req.method)) {
    return new Response(`Méthode ${req.method} non autorisée`, { status: 405 });
  }
  // Si la méthode est autorisée, on ne retourne rien pour que le code continue.
  return null;
}
