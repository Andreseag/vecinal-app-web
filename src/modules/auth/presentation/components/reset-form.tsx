"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/shared/ui/feedback";
import { Button, buttonStyles } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/input";
import { clientContainer } from "@/di/client";
import { resetSchema, type ResetValues } from "../schemas";
import { errorMessage } from "@/shared/lib/error-message";

export function ResetForm({ token }: { token?: string }) {
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  if (!token) {
    return (
      <div className="space-y-5">
        <Alert tone="error">El enlace no es válido o está incompleto. Solicita uno nuevo.</Alert>
        <Link href="/olvide-contrasena" className={buttonStyles({ variant: "outline", size: "lg", className: "w-full" })}>
          Solicitar un enlace nuevo
        </Link>
      </div>
    );
  }

  async function onSubmit({ password }: ResetValues) {
    setFormError(null);
    try {
      await clientContainer.auth.resetPassword.execute({ token: token as string, password });
      setDone(true);
    } catch (e) {
      setFormError(errorMessage(e, "No pudimos cambiar la contraseña. Intenta de nuevo."));
    }
  }

  if (done) {
    return (
      <div className="fade-up text-center" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success" aria-hidden="true">
          <CircleCheck className="size-7" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-brand">Contraseña actualizada</h2>
        <p className="mt-2 text-ink-soft">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link href="/iniciar-sesion" className={buttonStyles({ size: "lg", className: "mt-6 w-full" })}>
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && <Alert tone="error">{formError}</Alert>}
      <PasswordInput label="Nueva contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres, con letras y números." error={errors.password?.message} {...register("password")} />
      <PasswordInput label="Confirmar contraseña" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Guardar contraseña
      </Button>
    </form>
  );
}
