import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  secondary: "bg-brand text-white hover:bg-brand-deep",
  outline: "border border-line bg-white text-brand hover:border-accent hover:text-accent",
  ghost: "text-ink-soft hover:bg-surface hover:text-brand",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

interface StyleOptions {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** Úsalo en <Link> para que se vea como botón: className={buttonStyles({ variant: "outline" })} */
export function buttonStyles({ variant = "primary", size = "md", className }: StyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ComponentProps<"button">, StyleOptions {
  loading?: boolean;
}

export function Button({ variant, size, className, loading, disabled, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
