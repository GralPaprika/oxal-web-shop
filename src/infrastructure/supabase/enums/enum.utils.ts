/**
 * Generic Enum Utilities
 * Reusable functions for converting between enum codes and labels
 */

/**
 * Get enum label from code
 * @param code - The numeric code to convert
 * @param enumMap - The map of enum values to labels
 * @returns The label string or null
 */
export function getEnumLabel<T extends Record<string | number, string>>(
  code: number | null,
  enumMap: T,
): string | null {
  if (code === null) return null;
  return enumMap[code] || null;
}

/**
 * Get enum code from label
 * @param label - The label string to convert
 * @param reverseMap - The reverse map of labels to enum values
 * @returns The enum code or null
 */
export function getEnumCode<T extends Record<string, number | null>>(
  label: string | null,
  reverseMap: T,
): number | null {
  if (!label) return null;
  return (reverseMap[label] as number | null) || null;
}
