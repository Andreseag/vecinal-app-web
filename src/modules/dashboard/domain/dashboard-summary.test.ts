import { describe, expect, it } from "vitest";
import { tasaRecaudo } from "./dashboard-summary";

describe("tasaRecaudo", () => {
  it("calcula el % recaudado redondeado", () => {
    expect(tasaRecaudo({ esperado: 52_400_000, recaudado: 48_208_000 })).toBe(92);
  });

  it("devuelve 0 si no se esperaba recaudo (evita división por cero)", () => {
    expect(tasaRecaudo({ esperado: 0, recaudado: 100 })).toBe(0);
  });
});
