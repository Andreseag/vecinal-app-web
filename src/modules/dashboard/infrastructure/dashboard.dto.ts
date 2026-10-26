/** Contrato de red del dashboard (ver docs/API_CONTRACT.md). Las fechas llegan como ISO 8601. */
export interface DashboardDto {
  kpis: {
    carteraAlDia: number;
    carteraEnMora: number;
    solicitudesAbiertas: number;
    reservasHoy: number;
    ocupacion: number;
  };
  recaudo: { mes: string; esperado: number; recaudado: number }[];
  solicitudesRecientes: {
    id: string;
    titulo: string;
    ubicacion: string;
    estado: "pendiente" | "en_progreso" | "resuelta" | "rechazada";
    prioridad: "baja" | "media" | "alta";
    creadaEn: string;
  }[];
  reservasHoy: {
    id: string;
    amenidad: string;
    residente: string;
    unidad: string;
    inicio: string;
    fin: string;
  }[];
  pendientesAprobacion: number;
}
