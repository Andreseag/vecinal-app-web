/** Entidades y reglas de negocio del resumen de administración. Sin dependencias externas. */

export type RequestStatus = "pendiente" | "en_progreso" | "resuelta" | "rechazada";
export type RequestPriority = "baja" | "media" | "alta";

export interface DashboardKpis {
  /** % de cartera al día (0–100). */
  readonly carteraAlDia: number;
  /** Saldo total en mora, en COP. */
  readonly carteraEnMora: number;
  readonly solicitudesAbiertas: number;
  readonly reservasHoy: number;
  /** % de unidades ocupadas (0–100). */
  readonly ocupacion: number;
}

export interface RecaudoMes {
  /** "2026-05" */
  readonly mes: string;
  readonly esperado: number;
  readonly recaudado: number;
}

export interface SolicitudResumen {
  readonly id: string;
  readonly titulo: string;
  readonly ubicacion: string;
  readonly estado: RequestStatus;
  readonly prioridad: RequestPriority;
  readonly creadaEn: Date;
}

export interface ReservaResumen {
  readonly id: string;
  readonly amenidad: string;
  readonly residente: string;
  readonly unidad: string;
  readonly inicio: Date;
  readonly fin: Date;
}

export interface DashboardSummary {
  readonly kpis: DashboardKpis;
  readonly recaudo: readonly RecaudoMes[];
  readonly solicitudesRecientes: readonly SolicitudResumen[];
  readonly reservasHoy: readonly ReservaResumen[];
  /** Solicitudes de mantenimiento esperando aprobación. */
  readonly pendientesAprobacion: number;
}

/** Regla de negocio: % recaudado frente a lo esperado (0 si no se esperaba nada). */
export function tasaRecaudo({ esperado, recaudado }: Pick<RecaudoMes, "esperado" | "recaudado">): number {
  if (esperado <= 0) return 0;
  return Math.round((recaudado / esperado) * 100);
}
