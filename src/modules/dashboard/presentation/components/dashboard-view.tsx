"use client";

import { Building2, CalendarCheck, CircleDollarSign, ClipboardList, Inbox, TriangleAlert, Wallet, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader } from "@/shared/ui/card";
import { Alert, Badge, EmptyState, Skeleton } from "@/shared/ui/feedback";
import { useDashboard } from "../use-dashboard";
import { cn } from "@/shared/lib/cn";
import { formatCOPCompact, formatDate, formatTime } from "@/shared/lib/format";
import type { RequestPriority, RequestStatus } from "../../domain/dashboard-summary";
import { RecaudoChart } from "./recaudo-chart";

const STATUS: Record<RequestStatus, { label: string; tone: "warn" | "info" | "success" | "neutral" }> = {
  pendiente: { label: "Pendiente", tone: "warn" },
  en_progreso: { label: "En progreso", tone: "info" },
  resuelta: { label: "Resuelta", tone: "success" },
  rechazada: { label: "Rechazada", tone: "neutral" },
};

const PRIORITY: Record<RequestPriority, { label: string; tone: "danger" | "warn" | "neutral" }> = {
  alta: { label: "Alta", tone: "danger" },
  media: { label: "Media", tone: "warn" },
  baja: { label: "Baja", tone: "neutral" },
};

function Kpi({ icon: Icon, label, value, hint, tone = "accent" }: { icon: LucideIcon; label: string; value: string; hint?: string; tone?: "accent" | "danger" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-control", tone === "danger" ? "bg-danger/10 text-danger" : "bg-accent/10 text-accent")} aria-hidden="true">
          <Icon className="size-5" />
        </span>
        <p className="text-sm font-semibold text-ink-soft">{label}</p>
      </div>
      <p className="tnum mt-3 font-display text-3xl font-extrabold tracking-tight text-brand">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function DashboardView() {
  const { data, isPending, isError, refetch, isFetching } = useDashboard();

  if (isPending) return <DashboardSkeleton />;

  if (isError) {
    return (
      <Card>
        <EmptyState
          icon={TriangleAlert}
          title="No pudimos cargar el dashboard"
          description="Revisa tu conexión e intenta de nuevo."
          action={<Button onClick={() => refetch()} loading={isFetching}>Reintentar</Button>}
        />
      </Card>
    );
  }

  const { kpis, recaudo, solicitudesRecientes, reservasHoy, pendientesAprobacion } = data;

  return (
    <div className="fade-up space-y-6">
      {pendientesAprobacion > 0 && (
        <Alert tone="warn">
          <Link href="/mantenimiento" className="font-semibold underline underline-offset-4">
            {pendientesAprobacion} {pendientesAprobacion === 1 ? "solicitud espera" : "solicitudes esperan"} tu aprobación
          </Link>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Wallet} label="Cartera al día" value={`${kpis.carteraAlDia} %`} hint="Unidades sin saldo vencido" />
        <Kpi icon={CircleDollarSign} label="Cartera en mora" value={formatCOPCompact(kpis.carteraEnMora)} hint="Saldo total vencido" tone="danger" />
        <Kpi icon={ClipboardList} label="Solicitudes abiertas" value={String(kpis.solicitudesAbiertas)} hint="Mantenimiento activo" />
        <Kpi icon={Building2} label="Ocupación" value={`${kpis.ocupacion} %`} hint="Unidades ocupadas" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recaudo mensual" description="Lo recaudado frente a lo esperado, últimos 6 meses" />
          <div className="p-5">
            <RecaudoChart data={recaudo} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Reservas de hoy" action={<Badge tone="info">{reservasHoy.length}</Badge>} />
          {reservasHoy.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="Sin reservas hoy" />
          ) : (
            <ul role="list" className="divide-y divide-line">
              {reservasHoy.map((r) => (
                <li key={r.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-brand">{r.amenidad}</p>
                    <p className="tnum shrink-0 text-xs font-semibold text-accent">{formatTime(r.inicio)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">{r.residente} · {r.unidad}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Solicitudes recientes"
          action={<Link href="/mantenimiento" className="text-sm font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">Ver todas</Link>}
        />
        {solicitudesRecientes.length === 0 ? (
          <EmptyState icon={Inbox} title="No hay solicitudes" description="Cuando los residentes reporten algo, aparecerá aquí." />
        ) : (
          <ul role="list" className="divide-y divide-line">
            {solicitudesRecientes.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand">{s.titulo}</p>
                  <p className="text-sm text-ink-soft">{s.ubicacion} · {formatDate(s.creadaEn)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={PRIORITY[s.prioridad].tone}>{PRIORITY[s.prioridad].label}</Badge>
                  <Badge tone={STATUS[s.estado].tone}>{STATUS[s.estado].label}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
