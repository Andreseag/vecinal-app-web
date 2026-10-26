#!/usr/bin/env node
/**
 * Generador de módulos (scaffolding) — Clean Architecture.
 *
 *   npm run gen:module -- <modulo> <Entidad> [<Plural>]
 *   npm run gen:module -- properties Property Properties
 *   npm run gen:module -- residentes Residente Residentes
 *
 * Crea las 4 capas del módulo con un ejemplo mínimo que COMPILA y PASA las reglas
 * de arquitectura, un test, y lo conecta en src/di/client.ts (marcadores `<scaffold:…>`).
 * Después: completa la entidad, el DTO y el mapper, y agrega las rutas al mock.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [moduleArg, entityArg, pluralArg] = process.argv.slice(2);

const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

if (!moduleArg || !entityArg) {
  fail("Uso: npm run gen:module -- <modulo> <Entidad> [<Plural>]\n  Ej.: npm run gen:module -- properties Property Properties");
}
if (!/^[a-z][a-z0-9-]*$/.test(moduleArg)) fail(`Nombre de módulo inválido "${moduleArg}": usa minúsculas y guiones (ej. access-control).`);
if (!/^[A-Z][A-Za-z0-9]*$/.test(entityArg)) fail(`Entidad inválida "${entityArg}": usa PascalCase (ej. Property).`);
if (pluralArg && !/^[A-Z][A-Za-z0-9]*$/.test(pluralArg)) fail(`Plural inválido "${pluralArg}": usa PascalCase (ej. Properties).`);

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
const pascal = (s) => kebab(s).split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join("");
const camel = (s) => {
  const p = pascal(s);
  return p[0].toLowerCase() + p.slice(1);
};

const mod = moduleArg; // properties
const modCamel = camel(mod); // properties / accessControl
const Entity = entityArg; // Property
const entity = kebab(Entity); // property
const entityCamel = camel(Entity); // property
const Plural = pluralArg ?? `${Entity}s`; // Properties
const plural = kebab(Plural); // properties
const pluralCamel = camel(Plural);

const base = join(root, "src/modules", mod);
if (existsSync(base)) fail(`El módulo "${mod}" ya existe en ${relative(root, base)}.`);

/* ------------------------------------------------------------------ plantillas */
const files = {
  [`domain/${entity}.ts`]: `/**
 * Entidad de dominio: ${Entity}. TypeScript puro, sin librerías.
 * Agrega aquí los campos y las reglas de negocio (funciones puras).
 */
export interface ${Entity} {
  readonly id: string;
}
`,

  [`domain/${entity}.repository.ts`]: `import type { RequestOptions } from "@/core/domain/use-case";
import type { ${Entity} } from "./${entity}";

/** PUERTO: de dónde salen los ${Plural}. La implementación vive en infrastructure/. */
export interface ${Entity}Repository {
  list(options?: RequestOptions): Promise<${Entity}[]>;
  getById(id: string, options?: RequestOptions): Promise<${Entity}>;
}
`,

  [`application/list-${plural}.use-case.ts`]: `import type { RequestOptions, UseCase } from "@/core/domain/use-case";
import type { ${Entity} } from "../domain/${entity}";
import type { ${Entity}Repository } from "../domain/${entity}.repository";

/** Lista los ${Plural}. Aquí va la lógica de aplicación (orden, filtros de negocio…). */
export class List${Plural}UseCase implements UseCase<RequestOptions | undefined, ${Entity}[]> {
  constructor(private readonly repository: ${Entity}Repository) {}

  execute(options?: RequestOptions) {
    return this.repository.list(options);
  }
}
`,

  [`application/get-${entity}.use-case.ts`]: `import type { RequestOptions, UseCase } from "@/core/domain/use-case";
import type { ${Entity} } from "../domain/${entity}";
import type { ${Entity}Repository } from "../domain/${entity}.repository";

/** Obtiene un ${Entity} por id. */
export class Get${Entity}UseCase implements UseCase<{ id: string } & RequestOptions, ${Entity}> {
  constructor(private readonly repository: ${Entity}Repository) {}

  execute({ id, signal }: { id: string } & RequestOptions) {
    return this.repository.getById(id, { signal });
  }
}
`,

  [`application/list-${plural}.use-case.test.ts`]: `import { describe, expect, it, vi } from "vitest";
import type { ${Entity} } from "../domain/${entity}";
import type { ${Entity}Repository } from "../domain/${entity}.repository";
import { List${Plural}UseCase } from "./list-${plural}.use-case";

describe("List${Plural}UseCase", () => {
  it("devuelve lo que entrega el repositorio", async () => {
    const items: ${Entity}[] = [{ id: "1" }];
    const repository: ${Entity}Repository = { list: vi.fn().mockResolvedValue(items), getById: vi.fn() };

    await expect(new List${Plural}UseCase(repository).execute()).resolves.toEqual(items);
  });
});
`,

  [`infrastructure/${entity}.dto.ts`]: `/**
 * Contrato de red de ${Entity} (ver docs/API_CONTRACT.md). La FORMA EXACTA que
 * entrega el backend; el resto de la app nunca la ve.
 */
export interface ${Entity}Dto {
  id: string;
}
`,

  [`infrastructure/${entity}.mapper.ts`]: `import type { ${Entity} } from "../domain/${entity}";
import type { ${Entity}Dto } from "./${entity}.dto";

/** DTO (red) → entidad de dominio. Convierte fechas, renombra campos, etc. */
export const to${Entity} = (dto: ${Entity}Dto): ${Entity} => ({
  id: dto.id,
});
`,

  [`infrastructure/http-${entity}.repository.ts`]: `import type { RequestOptions } from "@/core/domain/use-case";
import type { HttpClient } from "@/infrastructure/shared/http-client";
import type { ${Entity} } from "../domain/${entity}";
import type { ${Entity}Repository } from "../domain/${entity}.repository";
import type { ${Entity}Dto } from "./${entity}.dto";
import { to${Entity} } from "./${entity}.mapper";

/** Adaptador: ${Entity}Repository sobre el backend REST (GET /${mod}). */
export class Http${Entity}Repository implements ${Entity}Repository {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<${Entity}[]> {
    const dtos = await this.http.request<${Entity}Dto[]>({ path: "/${mod}", signal: options?.signal });
    return dtos.map(to${Entity});
  }

  async getById(id: string, options?: RequestOptions): Promise<${Entity}> {
    const dto = await this.http.request<${Entity}Dto>({
      path: \`/${mod}/\${encodeURIComponent(id)}\`,
      signal: options?.signal,
    });
    return to${Entity}(dto);
  }
}
`,

  [`presentation/use-${plural}.ts`]: `"use client";

import { useQuery } from "@tanstack/react-query";
import { clientContainer } from "@/di/client";

export const ${pluralCamel}Key = ["${plural}"] as const;

/** Hook de presentación: conecta React Query con el caso de uso. */
export function use${Plural}() {
  return useQuery({
    queryKey: ${pluralCamel}Key,
    queryFn: ({ signal }) => clientContainer.${modCamel}.list.execute({ signal }),
  });
}
`,
};

/* ------------------------------------------------------------------ escritura */
for (const [rel, content] of Object.entries(files)) {
  const abs = join(base, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
}

/* ------------------------------------------------------------------ DI (client) */
const diPath = join(root, "src/di/client.ts");
const m = `@/modules/${mod}`;
const importsBlock = [
  `import { Get${Entity}UseCase } from "${m}/application/get-${entity}.use-case";`,
  `import { List${Plural}UseCase } from "${m}/application/list-${plural}.use-case";`,
  `import { Http${Entity}Repository } from "${m}/infrastructure/http-${entity}.repository";`,
].join("\n");
const repoLine = `const ${entityCamel}Repository = new Http${Entity}Repository(backendHttp);`;
const containerBlock = `  ${modCamel}: {\n    list: new List${Plural}UseCase(${entityCamel}Repository),\n    get: new Get${Entity}UseCase(${entityCamel}Repository),\n  },`;

let wired = false;
if (existsSync(diPath)) {
  let di = readFileSync(diPath, "utf8");
  const markers = ["// <scaffold:imports>", "// <scaffold:repositories>", "// <scaffold:container>"];
  if (markers.every((k) => di.includes(k)) && !new RegExp(`^  ${modCamel}: \\{`, "m").test(di)) {
    di = di.replace("// <scaffold:imports>", `${importsBlock}\n// <scaffold:imports>`);
    di = di.replace("// <scaffold:repositories>", `${repoLine}\n// <scaffold:repositories>`);
    di = di.replace("// <scaffold:container>", `${containerBlock.trimStart().replace(/^/, "")}\n  // <scaffold:container>`);
    writeFileSync(diPath, di);
    wired = true;
  }
}

/* ------------------------------------------------------------------ resumen */
console.log(`\n✔ Módulo "${mod}" creado en src/modules/${mod}/\n`);
for (const rel of Object.keys(files)) console.log(`   ${join("src/modules", mod, rel)}`);

if (wired) {
  console.log(`\n✔ Conectado en src/di/client.ts  →  clientContainer.${modCamel}.list / .get`);
} else {
  console.log(`\n⚠ No pude editar src/di/client.ts (faltan marcadores o ya existe "${modCamel}"). Agrega a mano:\n`);
  console.log(`${importsBlock}\n\n${repoLine}\n\n${containerBlock}\n`);
}

console.log(`
Siguientes pasos:
  1. Completa la entidad, el DTO y el mapper (campos reales del backend).
  2. Agrega las rutas de ejemplo en src/infrastructure/server/mocks/handler.ts (GET /${mod}, GET /${mod}/:id).
  3. Crea la página:  src/app/(app)/<ruta>/page.tsx  (usa el hook use${Plural}).
  4. Documenta los endpoints en docs/API_CONTRACT.md.
  5. Verifica:  npm run check
`);
