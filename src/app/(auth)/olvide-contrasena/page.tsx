import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "@/modules/auth/presentation/components/forgot-form";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function ForgotPage() {
  return (
    <>
      <Link href="/iniciar-sesion" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-brand">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a iniciar sesión
      </Link>
      <h1 className="text-3xl font-extrabold text-brand">Recupera tu contraseña</h1>
      <p className="mt-2 mb-8 text-ink-soft">Te enviaremos un enlace para crear una contraseña nueva.</p>
      <ForgotForm />
    </>
  );
}
