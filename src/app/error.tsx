"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/feedback";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface p-6">
      <EmptyState
        icon={TriangleAlert}
        title="Algo salió mal"
        description="Tuvimos un problema al cargar esta página. Intenta de nuevo."
        action={<Button onClick={reset}>Reintentar</Button>}
      />
    </main>
  );
}
