import { NextResponse } from "next/server";
import { z } from "zod";
import { serverContainer } from "@/di/server";
import { errorToResponse } from "@/infrastructure/server/http-errors";
import { applySession } from "@/infrastructure/server/session-cookies";

const schema = z.object({ email: z.string(), password: z.string().min(1) });

/**
 * Controlador: inicia sesión con el caso de uso, guarda los tokens en cookies
 * httpOnly y devuelve SOLO el usuario al navegador.
 */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Revisa el correo y la contraseña." }, { status: 400 });
  }

  try {
    const { user, tokens } = await serverContainer.auth.login.execute(parsed.data);
    const out = NextResponse.json({ user });
    applySession(out, tokens);
    return out;
  } catch (e) {
    return errorToResponse(e);
  }
}
