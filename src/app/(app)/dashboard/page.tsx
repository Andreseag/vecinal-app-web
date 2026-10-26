import type { Metadata } from "next";
import { firstName } from "@/modules/auth/domain/user";
import { getCurrentUser } from "@/modules/auth/presentation/server/get-current-user";
import { DashboardView } from "@/modules/dashboard/presentation/components/dashboard-view";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHeader title={`Hola, ${user ? firstName(user) : ""}`} description="Así va la administración de tu conjunto hoy." />
      <DashboardView />
    </>
  );
}
