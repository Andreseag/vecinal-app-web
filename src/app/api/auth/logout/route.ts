import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverContainer } from "@/di/server";
import { ACCESS_COOKIE, clearSession } from "@/infrastructure/server/session-cookies";

/** Cierra sesión: avisa al backend (best-effort) y borra las cookies. */
export async function POST() {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (accessToken) {
    await serverContainer.auth.logout.execute({ accessToken }).catch(() => undefined);
  }

  const out = new NextResponse(null, { status: 204 });
  clearSession(out);
  return out;
}
