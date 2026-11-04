const customEndpoint = import.meta.env.VITE_DEClic_AI_URL as string | undefined;
export const aiEndpoint = (customEndpoint || '/api/ai').replace(/\/$/, '');
let status: Promise<boolean> | undefined;
let expires = 0;

export function aiAvailable(): Promise<boolean> {
  // A separately configured Worker has its own contract without a status route.
  if (customEndpoint) return Promise.resolve(/^(https:\/\/|\/)/.test(customEndpoint));
  if (!status || Date.now() >= expires) {
    expires = Date.now() + 60_000;
    status = fetch('/api/ai/status', {signal: AbortSignal.timeout(2500)})
      .then(async response => response.ok && (await response.json()).configured === true)
      .catch(() => false);
  }
  return status;
}
