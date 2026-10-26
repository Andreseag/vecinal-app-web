import { z } from "zod";

/** Variables de entorno del SERVIDOR (nunca llegan al navegador). */
const schema = z.object({
  API_URL: z.string().url().default("http://localhost:4000/api/v1"),
  API_MOCK: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
});

export const env = schema.parse({
  API_URL: process.env.API_URL?.replace(/\/$/, "") || undefined,
  API_MOCK: process.env.API_MOCK || undefined,
});
