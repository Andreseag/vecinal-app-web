import { describe, expect, it } from "vitest";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from "@/core/domain/errors";
import { mapHttpError } from "./http-error-mapper";

describe("mapHttpError", () => {
  it.each([
    [401, UnauthorizedError],
    [403, ForbiddenError],
    [404, NotFoundError],
    [409, ConflictError],
    [500, ServerError],
    [503, ServerError],
  ])("status %i → %o", (status, Expected) => {
    expect(mapHttpError(status)).toBeInstanceOf(Expected);
  });

  it("422/400 → ValidationError con errores por campo", () => {
    const e = mapHttpError(422, { message: "Datos inválidos", errors: { email: ["Ya existe"] } });
    expect(e).toBeInstanceOf(ValidationError);
    expect((e as ValidationError).fieldErrors).toEqual({ email: ["Ya existe"] });
    expect(e.message).toBe("Datos inválidos");
  });

  it("usa un mensaje por defecto y conserva el code", () => {
    const e = mapHttpError(418, { code: "TEAPOT" });
    expect(e).toBeInstanceOf(AppError);
    expect(e.message).toBe("Ocurrió un error inesperado.");
    expect(e.code).toBe("TEAPOT");
  });
});
