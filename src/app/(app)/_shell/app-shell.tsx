"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { clientContainer } from "@/di/client";
import type { User } from "@/modules/auth/domain/user";
import { Logo } from "@/shared/brand/logo";
import { cn } from "@/shared/lib/cn";
import { initials } from "@/shared/lib/format";
import { NAV } from "./nav";

const ROLE_LABEL: Record<User["role"], string> = {
  admin: "Administrador",
  operador: "Operador",
  porteria: "Portería",
  consejo: "Consejo",
};

function SidebarContent({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [leaving, setLeaving] = useState(false);

  async function onLogout() {
    setLeaving(true);
    try {
      await clientContainer.auth.signOut.execute();
    } finally {
      queryClient.clear();
      router.replace("/iniciar-sesion");
      router.refresh();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/dashboard" onClick={onNavigate} aria-label="Vecinal, ir al dashboard" className="rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Principal" className="flex-1 overflow-y-auto px-3 py-2">
        <ul role="list" className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-semibold transition-colors",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-bright",
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", active && "text-accent-bright")} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-control px-2 py-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-bright font-display text-sm font-bold text-brand" aria-hidden="true">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-white/60">{ROLE_LABEL[user.role]} · {user.organization}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={leaving}
          className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-control px-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-bright disabled:opacity-60"
        >
          <LogOut className="size-5" aria-hidden="true" />
          {leaving ? "Cerrando sesión…" : "Cerrar sesión"}
        </button>
      </div>
    </div>
  );
}

export function AppShell({ user, children }: { user: User; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus({ preventScroll: true });
  }, []);

  // Cerrar al cambiar de ruta
  useEffect(() => setOpen(false), [pathname]);

  // Drawer móvil: bloquear scroll, Escape y foco inicial
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("overflow-hidden");
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand lg:block">
        <SidebarContent user={user} />
      </aside>

      {/* Barra superior móvil */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-white px-3 lg:hidden">
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          className="grid size-11 place-items-center rounded-control text-brand hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
        <Logo onDark={false} className="[&_svg]:h-7 [&_span]:text-xl" />
      </header>

      {/* Drawer móvil */}
      {open && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-brand-deep/60" onClick={close} aria-hidden="true" />
          <div id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menú principal" className="fade-up fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-brand shadow-pop">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-control text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-accent-bright"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <SidebarContent user={user} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
