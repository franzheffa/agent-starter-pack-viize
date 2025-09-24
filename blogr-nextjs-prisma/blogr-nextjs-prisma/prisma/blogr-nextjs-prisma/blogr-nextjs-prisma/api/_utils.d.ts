declare module './_utils.js' {
  export function base(): string;
  export function methodGuard(req: Request, allowed: string[]): Promise<Response|undefined>;
  export function passThrough(up: Response): Response;
  export const gw: typeof base;
}
