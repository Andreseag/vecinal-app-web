import {
  Building2,
  CalendarCheck,
  DoorOpen,
  LayoutDashboard,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/** Fuente única del menú lateral y de las páginas de cada módulo. */
export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Resumen y analítica de tu administración." },
  { href: "/propiedades", label: "Propiedades", icon: Building2, description: "Inmuebles, detalles y residentes vinculados." },
  { href: "/residentes", label: "Residentes", icon: Users, description: "Directorio de propietarios y residentes." },
  { href: "/mantenimiento", label: "Mantenimiento", icon: Wrench, description: "Solicitudes, seguimiento y aprobaciones." },
  { href: "/pagos", label: "Pagos", icon: Wallet, description: "Historial financiero y recordatorios de pago." },
  { href: "/amenidades", label: "Amenidades", icon: CalendarCheck, description: "Áreas comunes, reservas y calendario." },
  { href: "/acceso", label: "Control de acceso", icon: DoorOpen, description: "Visitantes, visitas recurrentes y entradas." },
];
