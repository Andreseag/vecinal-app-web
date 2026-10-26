import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/modules/auth/presentation/server/get-current-user";
import { AppShell } from "./_shell/app-shell";

/** Layout de la zona privada: carga el usuario en el servidor y pinta el shell. */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/iniciar-sesion");
  return <AppShell user={user}>{children}</AppShell>;
}
