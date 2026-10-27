import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, LogoMark } from "@/shared/brand/logo";
import { CopilotPreview } from "@/modules/auth/presentation/components/copilot-preview";

/**
 * Layout de las pantallas de acceso (iniciar sesión, recuperar contraseña…).
 *   · Escritorio: panel de marca a la izquierda + formulario a la derecha.
 *   · Móvil: solo el formulario, con cabecera y pie propios.
 *
 * ⚙️ NEXT_PUBLIC_MARKETING_URL (opcional): URL de la landing (ej. https://vecinal.co).
 *    Si existe, se muestra "¿Aún no tienes cuenta? Solicita una demo" → {URL}/demo.
 */
const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, "");

const points = [
  {
    icon: Building2,
    text: "Propiedades, residentes y pagos en un solo panel.",
  },
  { icon: Sparkles, text: "Un copiloto que prepara el trabajo repetitivo." },
  { icon: ShieldCheck, text: "Acceso seguro y trazabilidad de cada acción." },
];

const linkClass =
  "font-semibold text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-control bg-white px-4 py-2 font-semibold text-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al formulario
      </a>

      {/* ───────── Panel de marca (solo escritorio) ───────── */}
      <aside
        aria-label="Sobre Vecinal"
        className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-b from-brand to-brand-deep p-12 text-white lg:flex">
        {/* Marca decorativa de fondo */}
        <LogoMark
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -right-40 h-auto w-[28rem] opacity-[0.06]"
        />

        <Logo className="relative" />

        <div className="relative">
          {/* <p> y no <h2>: el <h1> de la página está en el formulario */}
          <p className="max-w-md font-display text-4xl font-extrabold leading-[1.1] tracking-tight">
            Deja de apagar incendios.{" "}
            <span className="text-accent-bright">Empieza a administrar.</span>
          </p>

          <ul role="list" className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/80">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-control bg-white/10 text-accent-bright"
                  aria-hidden="true">
                  <Icon className="size-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {/* Vista previa animada del copiloto (decorativa). Se oculta en pantallas bajas. */}
          <CopilotPreview />
        </div>

        <p className="relative text-sm text-white/50">© {year} Vecinal</p>
      </aside>

      {/* ───────── Formulario ───────── */}
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="flex items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <Link
            href="/"
            aria-label="Vecinal, ir al inicio"
            className="rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:hidden">
            <Logo onDark={false} />
          </Link>

          {MARKETING_URL && (
            <p className="ml-auto text-sm text-ink-soft">
              <span className="hidden sm:inline">¿Aún no tienes cuenta? </span>
              <a href={`${MARKETING_URL}/demo`} className={linkClass}>
                Solicita una demo
              </a>
            </p>
          )}
        </header>

        {/* Anclado arriba (no centrado): si aparece un error, el título NO se mueve (sin salto de layout) */}
        <main
          id="contenido"
          className="flex flex-1 items-start justify-center px-6 pb-12 pt-6 sm:px-10 lg:pt-[14vh]">
          <div className="fade-up w-full max-w-md">{children}</div>
        </main>

        <footer className="px-6 py-5 text-center text-xs text-ink-soft sm:px-10 lg:hidden">
          © {year} Vecinal
        </footer>
      </div>
    </div>
  );
}
