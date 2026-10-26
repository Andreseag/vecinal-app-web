import { ValidationError } from "@/core/domain/errors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Value object: un correo siempre válido y normalizado (minúsculas, sin espacios). */
export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Email {
    const value = raw.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      throw new ValidationError("Ingresa un correo válido.", { email: ["Ingresa un correo válido."] });
    }
    return new Email(value);
  }

  toString() {
    return this.value;
  }
}
