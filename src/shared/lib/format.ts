/** Formateadores es-CO. Zona horaria fija para evitar desajustes de hidratación. */
const TZ = "America/Bogota";

const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const copCompact = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });
const dateShort = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: TZ });
const timeShort = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });
const monthShort = new Intl.DateTimeFormat("es-CO", { month: "short", timeZone: "UTC" });

/** 1240000 → "$ 1.240.000" */
export const formatCOP = (value: number) => cop.format(value);

/** 48250000 → "$ 48,3 M" */
export const formatCOPCompact = (value: number) => `$ ${copCompact.format(value)}`;

/** "2026-10-22T14:00:00-05:00" → "22 oct" */
export const formatDate = (value: Date | string) => dateShort.format(new Date(value));

/** → "2:00 p. m." */
export const formatTime = (value: Date | string) => timeShort.format(new Date(value));

/** "2026-05" → "may" */
export function formatMonth(yyyyMm: string) {
  const [y, m] = yyyyMm.split("-").map(Number);
  return monthShort.format(new Date(Date.UTC(y ?? 2000, (m ?? 1) - 1, 1)));
}

/** "Mariana Gómez" → "MG" */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
