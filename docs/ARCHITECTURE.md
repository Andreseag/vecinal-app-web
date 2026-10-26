# Arquitectura del front — Clean Architecture

Objetivo: que el negocio (reglas, casos de uso) **no dependa** de React, Next.js, `fetch`
ni del backend concreto. Así se puede cambiar el backend, probar sin navegador y crecer
módulo a módulo sin que todo se enrede.

## La regla de oro

Las dependencias apuntan **hacia adentro**. Lo de adentro no conoce lo de afuera.

```
        presentation ───▶ application ───▶ domain ◀─── infrastructure
        (UI, hooks)       (casos de uso)   (entidades,   (HTTP, mocks,
                                            puertos)      cookies)

                    di/  ← único lugar que conoce a todos (composition root)
```

## Capas

| Capa | Dónde | Qué contiene | Puede importar |
|---|---|---|---|
| **Domain** | `src/core/domain`, `src/modules/*/domain` | Entidades, value objects (`Email`), reglas (`tasaRecaudo`, política de contraseñas), **puertos** (interfaces `AuthRepository`…), errores | Solo domain. **Cero librerías.** |
| **Application** | `src/modules/*/application` | Casos de uso (`LoginUseCase`, `GetDashboardSummaryUseCase`…): orquestan dominio y puertos | Domain |
| **Infrastructure** | `src/modules/*/infrastructure`, `src/infrastructure` | Adaptadores que **implementan los puertos**: repositorios HTTP, DTOs y mappers, cliente HTTP, cookies, mocks | Domain, otras piezas de infraestructura |
| **Presentation** | `src/modules/*/presentation`, `src/shared/ui`, `src/app` | Componentes, hooks de React Query, esquemas de formulario, páginas y route handlers | Application/Domain **vía `di/`**; nunca infraestructura |
| **DI** | `src/di` | `client.ts` y `server.ts`: arman repositorios + casos de uso | Todo |

Carpetas de apoyo: `src/core` (kernel: errores, `UseCase`), `src/shared` (UI genérica y utilidades sin negocio).

### Se hace cumplir con una herramienta, no con buena voluntad

`npm run arch:check` (dependency-cruiser, ver `.dependency-cruiser.cjs`) falla si alguien:
importa una librería en el dominio, usa HTTP desde un caso de uso, importa un repositorio
desde un componente, mezcla código de servidor en el bundle del navegador, importa un módulo
desde otro o crea dependencias circulares. Córrelo en CI (`npm run check` hace typecheck + arquitectura + tests).

## Cliente vs. servidor (lo específico de Next.js)

El código corre en dos sitios, así que hay **dos composition roots**:

- `di/client.ts` → navegador. Los repositorios usan `BrowserHttpClient` contra `/api/backend` (BFF).
- `di/server.ts` → route handlers, `proxy.ts` y Server Components. Usan `ServerHttpClient` directo al backend.

Por eso la autenticación tiene dos puertos con intención distinta:

- `AuthRepository` (servidor): `login/refresh/me/logout` con tokens explícitos.
- `SessionGateway` (navegador): solo `signIn/signOut`; los tokens viven en cookies `httpOnly` y el JS nunca los ve.

## Flujos

**Login**: `LoginForm` → `clientContainer.auth.signIn` → `BrowserSessionGateway` → `POST /api/auth/login`
→ *route handler* (`serverContainer.auth.login` → `HttpAuthRepository` → backend) → guarda cookies → devuelve solo `user`.

**Dashboard**: `useDashboard` (React Query) → `GetDashboardSummaryUseCase` (ordena según el negocio)
→ `HttpDashboardRepository` (DTO → entidad con `Date`) → `BrowserHttpClient` → `/api/backend/dashboard` → backend.

**Sesión vencida**: `proxy.ts` renueva con el refresh token antes de renderizar; si un 401 llega a mitad de página,
el BFF reintenta una vez; si no se puede, React Query recibe `UnauthorizedError` y `providers.tsx` redirige a iniciar sesión.

## Errores

Los adaptadores traducen fallos técnicos a **errores de dominio** (`src/core/domain/errors.ts`):
`UnauthorizedError`, `InvalidCredentialsError`, `ValidationError` (con `fieldErrors`), `NotFoundError`, `NetworkError`, `ServerError`…
Los casos de uso lanzan; la UI usa `errorMessage(e)`. Ninguna capa interna conoce códigos HTTP.

## DTO ≠ entidad

El contrato de red vive en `*.dto.ts` y se convierte con `*.mapper.ts`. Si el backend cambia un nombre de campo
o formato de fecha, se toca **solo** el DTO y el mapper.

## Qué se prueba y dónde (`npm test`)

| Capa | Ejemplo | Cómo |
|---|---|---|
| Domain | `Email`, política de contraseñas, `tasaRecaudo` | Funciones puras |
| Application | `LoginUseCase`, `GetDashboardSummaryUseCase` | Repositorios falsos (`vi.fn()`) |
| Infrastructure | `HttpAuthRepository`, `toDashboardSummary`, `mapHttpError` | `HttpClient` falso |
| Presentation | (siguiente iteración) | Testing Library con `di/` mockeado |

## Receta: agregar un módulo (ej. `properties`)

Atajo: `npm run gen:module -- properties Property Properties` hace los pasos 1, 2, 3, 5 y el hook del 6 con un
ejemplo mínimo; tú completas los campos reales. Los pasos a mano son:

1. `modules/properties/domain/` → entidad `Property`, reglas y puerto `PropertyRepository`.
2. `modules/properties/application/` → casos de uso (`ListProperties`, `CreateProperty`…), con tests.
3. `modules/properties/infrastructure/` → `property.dto.ts`, `property.mapper.ts`, `http-property.repository.ts`.
4. `infrastructure/server/mocks/` → datos y rutas de ejemplo para `API_MOCK=true`.
5. `di/client.ts` → instanciar repositorio y casos de uso (y `di/server.ts` solo si se usan en el servidor).
6. `modules/properties/presentation/` → hooks de React Query, esquemas Zod de formulario y componentes.
7. `app/(app)/propiedades/page.tsx` → página delgada que compone la presentación.
8. `npm run check`.

## Decisiones y límites (pragmatismo)

- Sin librería de DI: fábricas manuales en `di/` (claras, tipadas, sin magia). Si crece mucho, se evalúa.
- Casos de uso delgados donde no hay lógica: se mantienen por consistencia y para que la UI nunca llame repositorios directo.
- Excepciones tipadas en lugar de `Result<T,E>`: encajan con React Query y con `try/catch` de formularios.
- Zod valida **formularios** (UX); las reglas de negocio viven en el dominio y se reutilizan (política de contraseñas).
- Las páginas de `app/` son delgadas: no contienen lógica de negocio.
