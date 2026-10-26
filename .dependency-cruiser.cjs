/**
 * Reglas de arquitectura (Clean Architecture). Se ejecutan con `npm run arch:check`
 * y deben pasar en CI. La regla de oro: las dependencias apuntan HACIA ADENTRO.
 *
 *   presentation ──▶ application ──▶ domain ◀── infrastructure
 *   (UI, hooks)      (casos de uso)  (entidades,   (HTTP, mocks,
 *                                     puertos)      cookies)
 *
 * `di/` es la única capa que conoce a todas (composition root).
 */

const DOMAIN = "^src/(core/domain|modules/[^/]+/domain)/";
const APPLICATION = "^src/modules/[^/]+/application/";
const MODULE_INFRA = "^src/modules/[^/]+/infrastructure/";
const INFRA = "^src/infrastructure/";
const PRESENTATION = "^src/modules/[^/]+/presentation/";

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Las dependencias circulares vuelven imposible razonar sobre las capas.",
      from: {},
      to: { circular: true },
    },
    {
      name: "domain-is-pure",
      severity: "error",
      comment: "El dominio no depende de nada fuera del dominio: ni librerías (React, Next, Zod…) ni otras capas.",
      from: { path: DOMAIN },
      to: {
        pathNot: DOMAIN,
        // permite los built-ins de TS/JS; prohíbe paquetes npm y todo lo demás de src/
        dependencyTypesNot: ["core"],
      },
    },
    {
      name: "application-only-domain",
      severity: "error",
      comment: "Los casos de uso solo conocen el dominio (entidades y puertos). Nada de HTTP, UI ni frameworks.",
      from: { path: APPLICATION },
      to: { pathNot: [DOMAIN, APPLICATION], dependencyTypesNot: ["core"] },
    },
    {
      name: "infrastructure-implements-domain",
      severity: "error",
      comment: "La infraestructura implementa los puertos del dominio; no usa casos de uso ni UI.",
      from: { path: [MODULE_INFRA, INFRA] },
      to: { path: [APPLICATION, PRESENTATION, "^src/(di|shared)/", "^src/app/"] },
    },
    {
      name: "presentation-not-infrastructure",
      severity: "error",
      comment:
        "La UI pide casos de uso al contenedor (di/); nunca importa adaptadores de infraestructura. " +
        "Excepción: la capa de entrega del servidor (presentation/server/, app/api/, proxy.ts) puede leer cookies y hablar con el gateway.",
      from: {
        path: [PRESENTATION, "^src/shared/", "^src/app/"],
        pathNot: ["^src/modules/[^/]+/presentation/server/", "^src/app/api/"],
      },
      to: { path: [MODULE_INFRA, INFRA] },
    },
    {
      name: "client-server-boundary",
      severity: "error",
      comment: "Código de navegador no puede importar código de servidor (cookies, env, backend).",
      from: { path: ["^src/shared/", "^src/di/client\\.ts", "^src/infrastructure/browser/", "^src/modules/[^/]+/presentation/(?!server/)"] },
      to: { path: ["^src/di/server\\.ts", "^src/infrastructure/server/", "^src/modules/[^/]+/presentation/server/"] },
    },
    {
      name: "no-cross-module",
      severity: "error",
      comment: "Los módulos no se importan entre sí (solo comparten el kernel `core/` y `shared/`). Si dos módulos necesitan algo, súbelo a core/.",
      from: { path: "^src/modules/([^/]+)/" },
      to: { path: "^src/modules/", pathNot: "^src/modules/$1/" },
    },
    {
      name: "core-and-shared-independent",
      severity: "error",
      comment: "core/ y shared/ no dependen de ningún módulo.",
      from: { path: "^src/(core|shared)/" },
      to: { path: "^src/modules/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "\\.test\\.tsx?$|\\.d\\.ts$" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: { exportsFields: ["exports"], conditionNames: ["import", "require", "node", "default", "types"] },
    reporterOptions: { text: { highlightFocused: true } },
  },
};
