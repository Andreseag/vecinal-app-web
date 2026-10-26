import type { RequestOptions } from "@/core/domain/use-case";
import type { DashboardSummary } from "./dashboard-summary";

/** PUERTO: de dónde sale el resumen. La implementación vive en infrastructure/. */
export interface DashboardRepository {
  getSummary(options?: RequestOptions): Promise<DashboardSummary>;
}
