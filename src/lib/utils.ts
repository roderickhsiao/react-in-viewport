export function omit<T extends object>(
  obj: T,
  keys: string[],
): Omit<T, string> {
  const result = { ...obj } as Record<string, unknown>;
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, string>;
}
