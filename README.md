# Vecinal App — Panel de administración (front)

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS v4 · TanStack Query · React Hook Form + Zod · **Clean Architecture**.

El backend se desarrolla aparte y se consume como **API REST**. Mientras no exista,
el front funciona completo con **datos de ejemplo** (`API_MOCK=true`).

## Arranque

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Credenciales de la demo (solo con `API_MOCK=true`): `demo@vecinal.co` / `Vecinal2026*`

| Comando | Qué hace |
|---|---|
| `npm run check` | **Todo en uno para CI**: tipos + reglas de arquitectura + tests |
| `npm run typecheck` | TypeScript |
| `npm run arch:check` | Verifica que nadie rompa la regla de dependencias (dependency-cruiser) |
| `npm test` / `npm run test:watch` | Vitest |
| `npm run gen:module -- <modulo> <Entidad> [<Plural>]` | **Genera un módulo completo** (4 capas + test + conexión en `di/`) |
| `npm run build` / `npm start` | Producción |

> TypeScript está fijado en la 6.x porque dependency-cruiser todavía no soporta la 7.

## Crear un módulo nuevo (scaffolding)

```bash
npm run gen:module -- properties Property Properties
```

Crea `src/modules/properties/` con domain, application, infrastructure y presentation (un ejemplo mínimo que
compila, pasa las reglas de arquitectura y trae un test) y lo conecta en `src/di/client.ts`.
Luego solo completas la entidad, el DTO y el mapper, agregas las rutas al mock y creas la página.
No borres los comentarios `// <scaffold:…>` de `src/di/client.ts`: el generador los usa para enchufar módulos.

## Conectar el backend real

1. En `.env.local`: `API_MOCK=false` y `API_URL=https://tu-backend/api/v1`.
2. El backend debe cumplir `docs/API_CONTRACT.md`.
3. No hay que tocar componentes ni casos de uso: solo cambia la infraestructura.

## Arquitectura (resumen — detalle en `docs/ARCHITECTURE.md`)

```
src/
├─ core/domain/                  Kernel: errores tipados, UseCase
├─ modules/
│  ├─ auth/        ┐
│  └─ dashboard/   ┘  cada módulo tiene 4 capas:
│     ├─ domain/          entidades, reglas, PUERTOS (interfaces)
│     ├─ application/     casos de uso
│     ├─ infrastructure/  DTOs, mappers, repositorios HTTP
│     └─ presentation/    componentes, hooks, esquemas de formulario
├─ infrastructure/               Transversal: cliente HTTP (navegador/servidor), cookies, mocks
├─ di/                           client.ts · server.ts  (composition roots)
├─ shared/                       UI genérica (ui/, brand/) y utilidades sin negocio
├─ app/                          Rutas Next (delgadas) + route handlers (controladores)
└─ proxy.ts                      Protege rutas y renueva sesión (Next 16)
```

Regla de oro: **las dependencias apuntan hacia adentro** (`presentation → application → domain ← infrastructure`),
y se verifica automáticamente con `npm run arch:check`.

### Decisiones clave de seguridad

- Sesión en cookies `httpOnly` (el JS del navegador nunca ve los tokens).
- BFF `/api/backend/*`: sin CORS, sin exponer `API_URL`, renovación automática del token.
- `proxy.ts` es barrera de UX, no de seguridad: el backend debe autorizar cada request.

## Pendiente antes de producción

- CSP estricta con nonces (hoy hay cabeceras básicas en `next.config.ts`).
- Rate limiting y bloqueo de login en el backend.
- Tests de presentación (Testing Library) y E2E (Playwright).
- Monitoreo de errores (Sentry u otro) y analítica.

## Hoja de ruta

| Iteración | Contenido |
|---|---|
| 1 ✅ | Fundación, sistema de diseño, autenticación, shell, dashboard |
| 1.5 ✅ | Refactor a Clean Architecture + tests + verificación automática de capas |
| 2 | Primitivas de tabla/diálogo/filtros + Propiedades + Residentes |
| 3 | Mantenimiento (con aprobación) + Pagos (historial y recordatorios) |
| 4 | Amenidades (calendario de reservas) + Control de acceso |
