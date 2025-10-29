/**
 * Text normalization utilities for search functionality
 */

/**
 * Normalizes text by removing accents, converting to lowercase, and removing extra whitespace
 * This allows for accent-insensitive and case-insensitive search
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^\w\s]/g, ' ') // Replace non-word characters with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Checks if the search term matches any part of the text (accent-insensitive, case-insensitive)
 */
export function matchesSearchTerm(text: string, searchTerm: string): boolean {
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);

  return normalizedText.includes(normalizedSearch);
}