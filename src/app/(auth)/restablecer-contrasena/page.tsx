import type { Metadata } from "next";
import { ResetForm } from "@/modules/auth/presentation/components/reset-form";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <>
      <h1 className="text-3xl font-extrabold text-brand">Crea tu nueva contraseña</h1>
      <p className="mt-2 mb-8 text-ink-soft">Elige una contraseña segura que no uses en otros sitios.</p>
      <ResetForm token={token} />
    </>
  );
}
