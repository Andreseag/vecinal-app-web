import { SearchX } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/feedback";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface p-6">
      <EmptyState
        icon={SearchX}
        title="No encontramos esta página"
        description="Puede que el enlace esté roto o que la página ya no exista."
        action={
          <Link href="/dashboard" className={buttonStyles()}>
            Volver al dashboard
          </Link>
        }
      />
    </main>
  );
}
