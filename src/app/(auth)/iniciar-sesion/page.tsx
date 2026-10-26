import type { Metadata } from "next";
import { LoginForm } from "@/modules/auth/presentation/components/login-form";
import { serverConfig } from "@/di/server";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <>
      <h1 className="text-3xl font-extrabold text-brand">Bienvenido de nuevo</h1>
      <p className="mt-2 mb-8 text-ink-soft">Ingresa a tu panel para administrar tu conjunto.</p>
      <LoginForm next={next} demoHint={serverConfig.mockMode} />
    </>
  );
}
