"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
}

/**
 * Input con etiqueta, ayuda y error accesibles (aria-describedby / aria-invalid).
 * Compatible con react-hook-form:  <Input label="Correo" {...register("email")} />
 */
export function Input({ label, error, hint, endAdornment, className, id, ...props }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-semibold text-brand">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "block min-h-12 w-full rounded-control border bg-white px-4 py-3 text-base text-ink",
            "placeholder:text-ink-soft/70 transition-colors",
            "focus:border-accent focus:outline-2 focus:outline-accent/30",
            error ? "border-danger" : "border-line",
            endAdornment && "pr-12",
            className,
          )}
          {...props}
        />
        {endAdornment && <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Input de contraseña con botón mostrar/ocultar. */
export function PasswordInput(props: Omit<ComponentProps<typeof Input>, "type" | "endAdornment">) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="grid size-10 place-items-center rounded-control text-ink-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-accent"
        >
          {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
        </button>
      }
    />
  );
}
