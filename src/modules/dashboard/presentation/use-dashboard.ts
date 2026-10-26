"use client";

import { useQuery } from "@tanstack/react-query";
import { clientContainer } from "@/di/client";

export const dashboardKey = ["dashboard"] as const;

/** Hook de presentación: conecta React Query con el caso de uso. */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKey,
    queryFn: ({ signal }) => clientContainer.dashboard.getSummary.execute({ signal }),
  });
}
