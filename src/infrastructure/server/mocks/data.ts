import type { UserDto } from "@/modules/auth/infrastructure/auth.dto";
import type { DashboardDto } from "@/modules/dashboard/infrastructure/dashboard.dto";

/**
 * Datos de EJEMPLO para trabajar sin backend (API_MOCK=true).
 * Credenciales de prueba:  demo@vecinal.co  /  Vecinal2026*
 */
export const DEMO_EMAIL = "demo@vecinal.co";
export const DEMO_PASSWORD = "Vecinal2026*";

export const demoUser: UserDto = {
  id: "usr_demo",
  name: "Mariana Gómez",
  email: DEMO_EMAIL,
  role: "admin",
  organization: "Conjunto Residencial Los Pinos",
};

const MIN = 60_000;
const HOUR = 60 * MIN;

/** Dashboard con fechas relativas a "ahora" para que siempre se vea fresco. */
export function buildDashboard(): DashboardDto {
  const now = new Date();
  const at = (offsetMs: number) => new Date(now.getTime() + offsetMs).toISOString();

  const ratios = [0.88, 0.91, 0.86, 0.94, 0.9, 0.92];
  const esperado = 52_400_000;
  const recaudo = ratios.map((r, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - i), 1));
    const mes = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    return { mes, esperado, recaudado: Math.round(esperado * r) };
  });

  return {
    kpis: { carteraAlDia: 92, carteraEnMora: 18_640_000, solicitudesAbiertas: 14, reservasHoy: 4, ocupacion: 94 },
    recaudo,
    pendientesAprobacion: 3,
    solicitudesRecientes: [
      { id: "sol_1", titulo: "Filtración en techo del baño", ubicacion: "Torre B · Piso 4", estado: "pendiente", prioridad: "alta", creadaEn: at(-2 * HOUR) },
      { id: "sol_2", titulo: "Bombillo dañado en pasillo", ubicacion: "Torre A · Piso 2", estado: "en_progreso", prioridad: "baja", creadaEn: at(-7 * HOUR) },
      { id: "sol_3", titulo: "Ascensor con ruido al subir", ubicacion: "Torre C", estado: "en_progreso", prioridad: "media", creadaEn: at(-26 * HOUR) },
      { id: "sol_4", titulo: "Portón del parqueadero no cierra", ubicacion: "Acceso vehicular", estado: "resuelta", prioridad: "alta", creadaEn: at(-50 * HOUR) },
      { id: "sol_5", titulo: "Humedad en salón social", ubicacion: "Zona común", estado: "pendiente", prioridad: "media", creadaEn: at(-73 * HOUR) },
    ],
    reservasHoy: [
      { id: "res_1", amenidad: "Salón social", residente: "Carlos Ramírez", unidad: "Torre A · 301", inicio: at(2 * HOUR), fin: at(6 * HOUR) },
      { id: "res_2", amenidad: "Cancha múltiple", residente: "Andrea Pardo", unidad: "Torre C · 105", inicio: at(3 * HOUR), fin: at(4 * HOUR) },
      { id: "res_3", amenidad: "Zona BBQ", residente: "Luis Fernández", unidad: "Torre B · 402", inicio: at(5 * HOUR), fin: at(9 * HOUR) },
      { id: "res_4", amenidad: "Piscina", residente: "Diana Rojas", unidad: "Torre A · 208", inicio: at(6 * HOUR), fin: at(8 * HOUR) },
    ],
  };
}
