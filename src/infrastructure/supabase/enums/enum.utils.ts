export function getEnumLabel<T extends Record<string | number, string>>(
  code: number | null,
  enumMap: T,
): string | null {
  if (code === null) return null;
  return enumMap[code] || null;
}

export function getEnumCode<T extends Record<string, number | null>>(
  label: string | null,
  reverseMap: T,
): number | null {
  if (!label) return null;
  return (reverseMap[label] as number | null) || null;
}
