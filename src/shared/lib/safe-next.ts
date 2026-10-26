/** Evita "open redirect": solo acepta rutas internas ("/algo"), nunca URLs externas. */
export function safeNext(next?: string | null, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
