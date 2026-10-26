import { Hammer } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/feedback";
import { PageHeader } from "@/shared/ui/page-header";
import { NAV } from "../_shell/nav";

/**
 * Página temporal para los módulos aún no construidos. Cuando crees
 * `app/(app)/propiedades/page.tsx` (u otra), esa ruta específica tiene
 * prioridad sobre este comodín y esta página deja de usarse para ese módulo.
 */
const modules = NAV.filter((n) => n.href !== "/dashboard");
const find = (slug: string) => modules.find((m) => m.href === `/${slug}`);

export function generateStaticParams() {
  return modules.map((m) => ({ module: m.href.slice(1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: slug } = await params;
  return { title: find(slug)?.label ?? "No encontrado" };
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const item = find(slug);
  if (!item) notFound();

  return (
    <>
      <PageHeader title={item.label} description={item.description} />
      <Card>
        <EmptyState
          icon={Hammer}
          title="Módulo en construcción"
          description="Este módulo se habilitará en la siguiente iteración del front, a la espera del backend."
        />
      </Card>
    </>
  );
}
