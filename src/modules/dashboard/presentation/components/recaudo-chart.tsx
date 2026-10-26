import { formatCOPCompact, formatMonth } from "@/shared/lib/format";
import { tasaRecaudo, type RecaudoMes } from "../../domain/dashboard-summary";

/**
 * Barras de recaudo: la pista gris es lo "esperado" del mes y el relleno verde
 * lo "recaudado". Sin librerías de gráficos (cero peso extra). Incluye tabla
 * oculta para lectores de pantalla.
 */
export function RecaudoChart({ data }: { data: readonly RecaudoMes[] }) {
  const max = Math.max(...data.map((d) => d.esperado), 1);

  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-4" style={{ height: "11rem" }} aria-hidden="true">
        {data.map((d) => {
          const pct = tasaRecaudo(d);
          return (
            <div key={d.mes} className="flex h-full flex-1 flex-col justify-end" title={`${formatMonth(d.mes)}: ${pct} % recaudado`}>
              <span className="tnum mb-1 text-center text-xs font-semibold text-ink-soft">{pct}%</span>
              <div className="relative w-full overflow-hidden rounded-t-lg bg-line" style={{ height: `${(d.esperado / max) * 100}%` }}>
                <div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-accent" style={{ height: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-2 sm:gap-4" aria-hidden="true">
        {data.map((d) => (
          <span key={d.mes} className="flex-1 text-center text-xs font-medium capitalize text-ink-soft">
            {formatMonth(d.mes)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft" aria-hidden="true">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-accent" /> Recaudado</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-line" /> Esperado</span>
      </div>

      <table className="sr-only">
        <caption>Recaudo mensual frente a lo esperado</caption>
        <thead>
          <tr><th>Mes</th><th>Recaudado</th><th>Esperado</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.mes}>
              <td>{formatMonth(d.mes)}</td>
              <td>{formatCOPCompact(d.recaudado)}</td>
              <td>{formatCOPCompact(d.esperado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
