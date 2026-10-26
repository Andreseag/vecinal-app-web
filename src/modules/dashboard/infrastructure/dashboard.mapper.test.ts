import { describe, expect, it } from "vitest";
import type { DashboardDto } from "./dashboard.dto";
import { toDashboardSummary } from "./dashboard.mapper";

const dto: DashboardDto = {
  kpis: { carteraAlDia: 92, carteraEnMora: 100, solicitudesAbiertas: 1, reservasHoy: 1, ocupacion: 94 },
  recaudo: [{ mes: "2026-10", esperado: 10, recaudado: 9 }],
  pendientesAprobacion: 3,
  solicitudesRecientes: [
    { id: "s1", titulo: "t", ubicacion: "u", estado: "resuelta", prioridad: "baja", creadaEn: "2026-10-24T14:00:00-05:00" },
  ],
  reservasHoy: [
    { id: "r1", amenidad: "a", residente: "r", unidad: "u", inicio: "2026-10-24T15:00:00-05:00", fin: "2026-10-24T16:00:00-05:00" },
  ],
};

describe("toDashboardSummary", () => {
  it("convierte las fechas ISO a Date", () => {
    const result = toDashboardSummary(dto);
    expect(result.solicitudesRecientes[0]?.creadaEn).toBeInstanceOf(Date);
    expect(result.solicitudesRecientes[0]?.creadaEn.toISOString()).toBe("2026-10-24T19:00:00.000Z");
    expect(result.reservasHoy[0]?.fin.getTime()).toBeGreaterThan(result.reservasHoy[0]!.inicio.getTime());
  });

  it("conserva el resto de los datos", () => {
    const result = toDashboardSummary(dto);
    expect(result.kpis.carteraAlDia).toBe(92);
    expect(result.pendientesAprobacion).toBe(3);
    expect(result.recaudo).toEqual(dto.recaudo);
  });
});
