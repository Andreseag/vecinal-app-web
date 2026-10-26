/**
 * Caso de uso: una acción de negocio con entrada y salida tipadas.
 * Se instancia con sus dependencias (puertos) por constructor → fácil de probar.
 */
export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

/** Opciones comunes de lectura (cancelación). */
export interface RequestOptions {
  signal?: AbortSignal;
}
