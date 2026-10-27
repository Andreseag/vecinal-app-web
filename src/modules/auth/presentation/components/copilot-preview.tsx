import { Check, Sparkles } from "lucide-react";

/**
 * Vista previa ANIMADA del Copiloto (decorativa, aria-hidden).
 * 100 % CSS: sin JavaScript ni hidratación. Bucle de 12 s:
 *   pregunta → "escribiendo…" → respuesta (el borde brilla) → botón pulsa → "¡Enviados!"
 * Con `prefers-reduced-motion` se muestra el estado final, sin movimiento.
 *
 * ⚙️ Duración: cambia `12s` en la variable --cp-loop. Para que se detenga tras N
 *    vueltas, reemplaza `infinite` por el número (ej. `2`).
 */
const css = `
.cp-card, .cp-user, .cp-typing, .cp-answer, .cp-cta, .cp-cta-idle, .cp-cta-done { --cp-loop: 12s; }

.cp-card        { animation: cp-card var(--cp-loop) ease infinite; }
.cp-user        { animation: cp-user var(--cp-loop) ease infinite; }
.cp-typing      { opacity: 0; animation: cp-typing var(--cp-loop) ease infinite; }
.cp-answer      { animation: cp-answer var(--cp-loop) ease infinite; }
.cp-cta         { animation: cp-cta var(--cp-loop) ease infinite; }
.cp-cta-idle    { animation: cp-idle var(--cp-loop) ease infinite; }
.cp-cta-done    { opacity: 0; animation: cp-done var(--cp-loop) ease infinite; }
.cp-dot         { animation: cp-bounce 0.9s ease-in-out infinite; }
.cp-dot:nth-child(2) { animation-delay: 0.15s; }
.cp-dot:nth-child(3) { animation-delay: 0.3s; }

/* El borde del panel "se ilumina" cuando llega la respuesta y cuando se envía */
@keyframes cp-card {
  0%, 24%  { border-color: rgb(255 255 255 / 0.1); }
  30%      { border-color: color-mix(in srgb, var(--color-accent-bright) 55%, transparent); }
  42%, 74% { border-color: rgb(255 255 255 / 0.1); }
  80%      { border-color: color-mix(in srgb, var(--color-accent-bright) 55%, transparent); }
  92%, 100%{ border-color: rgb(255 255 255 / 0.1); }
}
@keyframes cp-user {
  0%       { opacity: 0; transform: translateY(10px) scale(0.98); }
  3%, 94%  { opacity: 1; transform: none; }
  98%, 100%{ opacity: 0; transform: translateY(-4px); }
}
@keyframes cp-typing {
  0%, 6%   { opacity: 0; transform: translateY(6px); }
  9%, 22%  { opacity: 1; transform: none; }
  25%, 100%{ opacity: 0; transform: none; }
}
@keyframes cp-answer {
  0%, 23%  { opacity: 0; transform: translateY(8px); }
  28%, 94% { opacity: 1; transform: none; }
  98%, 100%{ opacity: 0; transform: translateY(-4px); }
}
@keyframes cp-cta {
  0%, 38%  { transform: scale(0.9); background-color: var(--color-accent); }
  42%      { transform: scale(1); }
  50%      { transform: scale(1.05); }
  56%      { transform: scale(1); }
  62%      { transform: scale(1.05); }
  68%      { transform: scale(1); }
  72%      { transform: scale(0.95); background-color: var(--color-accent); }
  76%, 94% { transform: scale(1); background-color: var(--color-success); }
  98%, 100%{ transform: scale(1); background-color: var(--color-accent); }
}
@keyframes cp-idle {
  0%, 38%  { opacity: 0; }
  42%, 72% { opacity: 1; }
  75%, 100%{ opacity: 0; }
}
@keyframes cp-done {
  0%, 73%  { opacity: 0; }
  77%, 94% { opacity: 1; }
  98%, 100%{ opacity: 0; }
}
@keyframes cp-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
  30%           { transform: translateY(-4px); opacity: 1; }
}

/* Sin movimiento: se ve el estado final y quieto */
@media (prefers-reduced-motion: reduce) {
  .cp-card, .cp-user, .cp-typing, .cp-answer, .cp-cta, .cp-cta-idle, .cp-cta-done, .cp-dot { animation: none; }
}
`;

export function CopilotPreview() {
  return (
    <>
      <style href="copilot-preview" precedence="default">
        {css}
      </style>

      <div
        aria-hidden="true"
        className="cp-card mt-10 max-w-md rounded-card border border-white/10 bg-white/5 p-5 [@media(max-height:780px)]:hidden">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60">
          <Sparkles className="size-4 text-accent-bright" />
          Copiloto Vecinal
        </div>

        <p className="cp-user ml-auto mt-4 w-fit max-w-[90%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-sm text-white">
          ¿A quién debo cobrar primero esta semana?
        </p>

        <div className="mt-3 flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-bright text-brand">
            <Sparkles className="size-4" />
          </span>

          {/* "Escribiendo…" y respuesta comparten celda: el panel no cambia de alto */}
          <div className="grid min-w-0 items-start justify-items-start">
            <div className="cp-typing flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 [grid-area:1/1]">
              <span className="cp-dot size-1.5 rounded-full bg-ink-soft" />
              <span className="cp-dot size-1.5 rounded-full bg-ink-soft" />
              <span className="cp-dot size-1.5 rounded-full bg-ink-soft" />
            </div>

            <div className="cp-answer rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-ink [grid-area:1/1]">
              Encontré <strong>7 unidades</strong> con riesgo de mora y dejé
              listo un recordatorio para cada una.
              <span className="cp-cta mt-3 grid w-fit rounded-control bg-accent px-3 py-1.5 text-xs font-semibold text-white">
                <span className="cp-cta-idle [grid-area:1/1]">
                  Aprobar y enviar (7)
                </span>
                <span className="cp-cta-done flex items-center justify-center gap-1 [grid-area:1/1]">
                  <Check className="size-3.5" />
                  ¡Enviados!
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
