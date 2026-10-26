import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

/** Marca: dos casas que comparten un muro. `onDark` usa la versión para fondos oscuros. */
export function LogoMark({
  onDark = true,
  className,
  ...props
}: { onDark?: boolean } & Omit<ComponentProps<"svg">, "viewBox">) {
  return (
    <svg
      viewBox="0 0 62 56"
      className={cn("h-8 w-auto", className)}
      aria-hidden="true"
      {...props}>
      <polygon
        points="4,24 20,8 36,24 36,52 4,52"
        className={onDark ? "fill-white" : "fill-brand"}
      />
      <polygon
        points="26,24 42,8 58,24 58,52 26,52"
        className={onDark ? "fill-accent-bright" : "fill-teal"}
      />
      <polygon
        points="26,24 31,19 36,24 36,52 26,52"
        className={onDark ? "fill-brand" : "fill-mint"}
      />
    </svg>
  );
}

export function Logo({
  onDark = true,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark onDark={onDark} />
      <span
        className={cn(
          "font-display text-2xl font-bold leading-none tracking-[-0.045em]",
          onDark ? "text-white" : "text-brand",
        )}>
        vecinal
      </span>
    </span>
  );
}
