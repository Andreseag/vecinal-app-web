import { CircleAlert, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

// ---------- Badge ----------
type Tone = "neutral" | "success" | "warn" | "danger" | "info";

const badgeTones: Record<Tone, string> = {
  neutral: "bg-surface text-ink-soft",
  success: "bg-success/10 text-success",
  warn: "bg-warn/15 text-[#92560a]",
  danger: "bg-danger/10 text-danger",
  info: "bg-accent/10 text-accent",
};

export function Badge({ tone = "neutral", className, ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", badgeTones[tone], className)}
      {...props}
    />
  );
}

// ---------- Skeleton ----------
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-control bg-line/70", className)} aria-hidden="true" />;
}

// ---------- Alert ----------
const alertStyles: Record<"error" | "warn" | "info", { box: string; icon: LucideIcon }> = {
  error: { box: "border-danger/30 bg-danger/5 text-danger", icon: CircleAlert },
  warn: { box: "border-warn/40 bg-warn/10 text-[#7a4a08]", icon: TriangleAlert },
  info: { box: "border-accent/30 bg-accent/5 text-accent", icon: Info },
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "error" | "warn" | "info";
  children: ReactNode;
  className?: string;
}) {
  const { box, icon: Icon } = alertStyles[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-control border px-4 py-3 text-sm font-medium", box, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// ---------- EmptyState ----------
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
        <Icon className="size-7" />
      </span>
      <h2 className="mt-4 font-display text-lg font-bold text-brand">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
