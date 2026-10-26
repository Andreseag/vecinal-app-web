import type { DashboardSummary } from "../domain/dashboard-summary";
import type { DashboardDto } from "./dashboard.dto";

/** DTO (texto/ISO) → entidad de dominio (con `Date`). */
export function toDashboardSummary(dto: DashboardDto): DashboardSummary {
  return {
    kpis: { ...dto.kpis },
    recaudo: dto.recaudo.map((r) => ({ ...r })),
    solicitudesRecientes: dto.solicitudesRecientes.map((s) => ({ ...s, creadaEn: new Date(s.creadaEn) })),
    reservasHoy: dto.reservasHoy.map((r) => ({ ...r, inicio: new Date(r.inicio), fin: new Date(r.fin) })),
    pendientesAprobacion: dto.pendientesAprobacion,
  };
}
