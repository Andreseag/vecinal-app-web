"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/shared/ui/feedback";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { clientContainer } from "@/di/client";
import { forgotSchema, type ForgotValues } from "../schemas";
import { errorMessage } from "@/shared/lib/error-message";

export function ForgotForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  async function onSubmit({ email }: ForgotValues) {
    setFormError(null);
    try {
      await clientContainer.auth.requestPasswordReset.execute({ email });
      setSentTo(email);
    } catch (e) {
      setFormError(errorMessage(e, "No pudimos enviar el correo. Intenta de nuevo."));
    }
  }

  if (sentTo) {
    return (
      <div className="fade-up text-center" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
          <MailCheck className="size-7" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-brand">Revisa tu correo</h2>
        <p className="mt-2 text-ink-soft">
          Si <strong className="text-ink">{sentTo}</strong> está registrado, te enviamos las instrucciones para crear una contraseña nueva.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && <Alert tone="error">{formError}</Alert>}
      <Input label="Correo electrónico" type="email" autoComplete="email" inputMode="email" placeholder="tu@correo.com" error={errors.email?.message} {...register("email")} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Enviar instrucciones
      </Button>
    </form>
  );
}
