import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/public-sans";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Vecinal", template: "%s · Vecinal" },
  description: "Panel de administración de conjuntos residenciales.",
  robots: { index: false, follow: false }, // es una app privada
};

export const viewport: Viewport = {
  themeColor: "#0b2e2f",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
