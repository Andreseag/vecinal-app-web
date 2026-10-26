import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/domain/errors";
import { Email } from "./email";

describe("Email", () => {
  it("normaliza a minúsculas y sin espacios", () => {
    expect(Email.create("  Demo@Vecinal.CO ").value).toBe("demo@vecinal.co");
  });

  it.each(["", "sin-arroba", "a@b", "a b@c.co"])("rechaza %j", (raw) => {
    expect(() => Email.create(raw)).toThrow(ValidationError);
  });
});
