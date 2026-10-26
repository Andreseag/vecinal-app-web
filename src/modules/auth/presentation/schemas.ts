import { z } from "zod";
import { validatePassword } from "../domain/password-policy";

/**
 * Validación de FORMULARIOS (UX inmediata). Las reglas de negocio (política de
 * contraseñas) vienen del dominio para no duplicarlas.
 */
export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotSchema = z.object({
  email: z.email("Ingresa un correo válido."),
});
export type ForgotValues = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({
    password: z.string().superRefine((value, ctx) => {
      for (const message of validatePassword(value)) ctx.addIssue({ code: "custom", message });
    }),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Las contraseñas no coinciden." });
export type ResetValues = z.infer<typeof resetSchema>;
