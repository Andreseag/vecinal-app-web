"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/shared/ui/feedback";
import { Button } from "@/shared/ui/button";
import { Input, PasswordInput } from "@/shared/ui/input";
import { clientContainer } from "@/di/client";
import { loginSchema, type LoginValues } from "../schemas";
import { errorMessage } from "@/shared/lib/error-message";
import { safeNext } from "@/shared/lib/safe-next";

export function LoginForm({ next, demoHint }: { next?: string; demoHint?: boolean }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      await clientContainer.auth.signIn.execute(values);
      router.replace(safeNext(next));
      router.refresh();
    } catch (e) {
      setFormError(errorMessage(e, "No pudimos iniciar sesión. Intenta de nuevo."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && <Alert tone="error">{formError}</Alert>}
      {demoHint && (
        <Alert tone="info">
          Modo demostración. Usa <strong>demo@vecinal.co</strong> y <strong>Vecinal2026*</strong>.
        </Alert>
      )}

      <Input label="Correo electrónico" type="email" autoComplete="email" inputMode="email" placeholder="tu@correo.com" error={errors.email?.message} {...register("email")} />
      <PasswordInput label="Contraseña" autoComplete="current-password" error={errors.password?.message} {...register("password")} />

      <div className="flex justify-end">
        <Link href="/olvide-contrasena" className="text-sm font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Iniciar sesión
      </Button>
    </form>
  );
}
