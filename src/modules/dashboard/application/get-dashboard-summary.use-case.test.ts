import { describe, expect, it, vi } from "vitest";
import type { DashboardSummary } from "../domain/dashboard-summary";
import type { DashboardRepository } from "../domain/dashboard.repository";
import { GetDashboardSummaryUseCase } from "./get-dashboard-summary.use-case";

const d = (iso: string) => new Date(iso);

const summary: DashboardSummary = {
  kpis: { carteraAlDia: 92, carteraEnMora: 1, solicitudesAbiertas: 2, reservasHoy: 2, ocupacion: 94 },
  recaudo: [],
  pendientesAprobacion: 0,
  solicitudesRecientes: [
    { id: "viejo", titulo: "a", ubicacion: "x", estado: "pendiente", prioridad: "alta", creadaEn: d("2026-10-01T10:00:00Z") },
    { id: "nuevo", titulo: "b", ubicacion: "x", estado: "pendiente", prioridad: "alta", creadaEn: d("2026-10-03T10:00:00Z") },
  ],
  reservasHoy: [
    { id: "tarde", amenidad: "Piscina", residente: "r", unidad: "u", inicio: d("2026-10-24T20:00:00Z"), fin: d("2026-10-24T21:00:00Z") },
    { id: "temprano", amenidad: "Salón", residente: "r", unidad: "u", inicio: d("2026-10-24T15:00:00Z"), fin: d("2026-10-24T16:00:00Z") },
  ],
};

describe("GetDashboardSummaryUseCase", () => {
  it("ordena solicitudes de más nueva a más antigua y reservas por hora", async () => {
    const repo: DashboardRepository = { getSummary: vi.fn().mockResolvedValue(summary) };
    const result = await new GetDashboardSummaryUseCase(repo).execute();

    expect(result.solicitudesRecientes.map((s) => s.id)).toEqual(["nuevo", "viejo"]);
    expect(result.reservasHoy.map((r) => r.id)).toEqual(["temprano", "tarde"]);
  });

  it("no muta el resultado del repositorio y reenvía la señal de cancelación", async () => {
    const getSummary = vi.fn().mockResolvedValue(summary);
    const signal = new AbortController().signal;
    await new GetDashboardSummaryUseCase({ getSummary }).execute({ signal });

    expect(getSummary).toHaveBeenCalledWith({ signal });
    expect(summary.solicitudesRecientes[0]?.id).toBe("viejo");
  });
});
