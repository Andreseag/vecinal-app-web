import type { RequestOptions } from "@/core/domain/use-case";
import type { HttpClient } from "@/infrastructure/shared/http-client";
import type { DashboardSummary } from "../domain/dashboard-summary";
import type { DashboardRepository } from "../domain/dashboard.repository";
import type { DashboardDto } from "./dashboard.dto";
import { toDashboardSummary } from "./dashboard.mapper";

/** Adaptador: DashboardRepository sobre el backend REST (GET /dashboard). */
export class HttpDashboardRepository implements DashboardRepository {
  constructor(private readonly http: HttpClient) {}

  async getSummary(options?: RequestOptions): Promise<DashboardSummary> {
    const dto = await this.http.request<DashboardDto>({ path: "/dashboard", signal: options?.signal });
    return toDashboardSummary(dto);
  }
}
