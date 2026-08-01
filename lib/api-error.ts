/**
 * Extracts a human-readable message from Mongoose / MongoDB errors.
 * Falls back to `fallback` for unexpected error shapes.
 */
export function mongoErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof Error)) return fallback;

  // Mongoose ValidationError — surfaces the first failing field message
  if (err.name === 'ValidationError') {
    const ve = err as Error & { errors?: Record<string, { message: string }> };
    if (ve.errors) {
      const messages = Object.values(ve.errors).map((e) => e.message);
      return messages.join('; ');
    }
    return err.message || fallback;
  }

  // MongoDB duplicate-key error (E11000)
  const me = err as Error & { code?: number; keyValue?: Record<string, unknown> };
  if (me.code === 11000 && me.keyValue) {
    const field = Object.keys(me.keyValue)[0];
    const value = me.keyValue[field];
    return `"${value}" is already taken for field "${field}". Please use a different value.`;
  }

  return err.message || fallback;
}

/**
 * Returns true when the error represents a client-side problem (validation,
 * bad cast or duplicate key) that should map to an HTTP 4xx response rather
 * than a generic 500.
 */
export function isClientError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const e = err as Error & { code?: number };
  return err.name === 'ValidationError' || err.name === 'CastError' || e.code === 11000;
}
