import { BrowserHttpClient } from "@/infrastructure/browser/browser-http-client";
import { GetDashboardSummaryUseCase } from "@/modules/dashboard/application/get-dashboard-summary.use-case";
import { HttpDashboardRepository } from "@/modules/dashboard/infrastructure/http-dashboard.repository";
import { RequestPasswordResetUseCase } from "@/modules/auth/application/request-password-reset.use-case";
import { ResetPasswordUseCase } from "@/modules/auth/application/reset-password.use-case";
import { SignInUseCase } from "@/modules/auth/application/sign-in.use-case";
import { SignOutUseCase } from "@/modules/auth/application/sign-out.use-case";
import { BrowserSessionGateway } from "@/modules/auth/infrastructure/browser-session.gateway";
import { HttpPasswordRecoveryRepository } from "@/modules/auth/infrastructure/http-password-recovery.repository";
// <scaffold:imports> — `npm run gen:module` agrega aquí los imports de los módulos nuevos

/**
 * COMPOSITION ROOT del NAVEGADOR: el único lugar donde se eligen las
 * implementaciones concretas. Los componentes piden casos de uso desde aquí y
 * nunca importan infraestructura. Para cambiar de backend o de mock, se toca solo esto.
 *
 * ⚠️ No importes nada de `@/di/server` ni de `@/infrastructure/server` aquí.
 */
const backendHttp = new BrowserHttpClient("/api/backend"); // BFF → backend (con token)
const sessionHttp = new BrowserHttpClient("/api"); // endpoints que escriben cookies

const sessionGateway = new BrowserSessionGateway(sessionHttp);
const passwordRecovery = new HttpPasswordRecoveryRepository(backendHttp);
const dashboardRepository = new HttpDashboardRepository(backendHttp);
// <scaffold:repositories>

export const clientContainer = {
  auth: {
    signIn: new SignInUseCase(sessionGateway),
    signOut: new SignOutUseCase(sessionGateway),
    requestPasswordReset: new RequestPasswordResetUseCase(passwordRecovery),
    resetPassword: new ResetPasswordUseCase(passwordRecovery),
  },
  dashboard: {
    getSummary: new GetDashboardSummaryUseCase(dashboardRepository),
  },
  // <scaffold:container>
} as const;
