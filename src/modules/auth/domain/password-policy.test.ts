import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/domain/errors";
import { assertValidPassword, validatePassword } from "./password-policy";

describe("política de contraseñas", () => {
  it("acepta una contraseña válida", () => {
    expect(validatePassword("Vecinal2026")).toEqual([]);
  });

  it("lista cada regla incumplida", () => {
    expect(validatePassword("abc")).toEqual(["Mínimo 8 caracteres.", "Incluye al menos un número."]);
    expect(validatePassword("12345678")).toEqual(["Incluye al menos una letra."]);
  });

  it("assertValidPassword lanza ValidationError con los errores por campo", () => {
    try {
      assertValidPassword("abc");
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as ValidationError).fieldErrors.password).toHaveLength(2);
    }
  });
});
