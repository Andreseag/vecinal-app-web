import { redirect } from "next/navigation";

/** La raíz lleva al dashboard; proxy.ts decide si antes toca iniciar sesión. */
export default function Home() {
  redirect("/dashboard");
}
