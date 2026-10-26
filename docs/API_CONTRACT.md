# Contrato de API — Vecinal (v0.1)

Este documento describe lo que el **front espera** del backend REST. En código, el contrato
vive en los DTOs: `src/modules/auth/infrastructure/auth.dto.ts` y
`src/modules/dashboard/infrastructure/dashboard.dto.ts`. Cualquier cambio se acuerda aquí primero
y se refleja solo en el DTO y su mapper (el resto de la app no se entera).

## Convenciones

- Base: `API_URL` (ej. `https://api.vecinal.co/api/v1`). JSON en request y response (`Content-Type: application/json`).
- Autenticación: `Authorization: Bearer <accessToken>` (el front lo agrega; el navegador nunca ve el token).
- Fechas en ISO 8601 con zona horaria. Montos en **pesos colombianos (COP) como enteros** (sin decimales).
- Errores: cualquier `4xx/5xx` devuelve

```json
{ "message": "Texto para mostrar al usuario", "code": "OPCIONAL", "errors": { "campo": ["detalle"] } }
```

  `errors` solo en validaciones (400/422). `message` debe estar en español y ser seguro de mostrar.

## Autenticación

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `200 { accessToken, refreshToken, expiresIn, user }` · `401` credenciales inválidas |
| POST | `/auth/refresh` | `{ refreshToken }` | `200 { accessToken, refreshToken, expiresIn }` · `401` si ya no sirve (**rotar** el refresh token es recomendable) |
| POST | `/auth/logout` | — | `204` (invalida el refresh token) |
| GET | `/auth/me` | — | `200 User` |
| POST | `/auth/forgot-password` | `{ email }` | `204` **siempre**, exista o no el correo |
| POST | `/auth/reset-password` | `{ token, password }` | `204` · `400 { code: "INVALID_TOKEN" }` si el enlace expiró |

- `expiresIn` en **segundos** (ej. `900`).
- El correo de recuperación debe llevar al front: `https://app.vecinal.co/restablecer-contrasena?token=<token>`.
- Recomendado en el backend: límite de intentos de login (rate limiting) y bloqueo temporal.

### `User`

```ts
{ id: string; name: string; email: string; role: "admin" | "operador" | "porteria" | "consejo"; organization: string }
```

## Dashboard

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/dashboard` | `DashboardDto` (ver `dashboard.dto.ts`) |

`DashboardDto` incluye: `kpis`, `recaudo` (últimos 6 meses), `solicitudesRecientes` (5),
`reservasHoy` y `pendientesAprobacion`.

## Próximos módulos (propuesta — se confirma al construir cada uno)

Listados paginados con este formato:

```json
{ "data": [ ... ], "meta": { "page": 1, "pageSize": 20, "total": 134 } }
```

Query: `?page=1&pageSize=20&search=texto&sort=campo:asc`.

| Módulo | Rutas |
|---|---|
| Propiedades | `GET/POST /properties`, `GET/PATCH /properties/:id`, `POST /properties/:id/residents` |
| Residentes | `GET/POST /residents`, `GET/PATCH /residents/:id` |
| Mantenimiento | `GET/POST /maintenance-requests`, `GET/PATCH /maintenance-requests/:id`, `POST /maintenance-requests/:id/approve` |
| Pagos | `GET /payments`, `GET /payments/:id`, `POST /payments/reminders` |
| Amenidades | `GET /amenities`, `GET/POST /reservations`, `PATCH /reservations/:id` |
| Control de acceso | `GET/POST /visitors`, `GET/POST /recurring-visits`, `GET /access-logs` |
