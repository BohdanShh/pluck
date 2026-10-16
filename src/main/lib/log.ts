export function logError(message: string, error: unknown) {
  console.error(`[Pluck] ${message}:`, error);
}
