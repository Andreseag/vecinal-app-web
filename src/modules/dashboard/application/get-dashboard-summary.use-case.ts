import type { RequestOptions, UseCase } from "@/core/domain/use-case";
import type { DashboardSummary } from "../domain/dashboard-summary";
import type { DashboardRepository } from "../domain/dashboard.repository";

/**
 * Obtiene el resumen y aplica el orden de negocio, sin depender de cómo lo
 * entregue el backend: solicitudes de más reciente a más antigua, reservas por hora.
 */
export class GetDashboardSummaryUseCase implements UseCase<RequestOptions | undefined, DashboardSummary> {
  constructor(private readonly dashboard: DashboardRepository) {}

  async execute(options?: RequestOptions): Promise<DashboardSummary> {
    const summary = await this.dashboard.getSummary(options);
    return {
      ...summary,
      solicitudesRecientes: [...summary.solicitudesRecientes].sort((a, b) => b.creadaEn.getTime() - a.creadaEn.getTime()),
      reservasHoy: [...summary.reservasHoy].sort((a, b) => a.inicio.getTime() - b.inicio.getTime()),
    };
  }
}
