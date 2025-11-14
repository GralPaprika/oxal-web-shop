/**
 * Database Enums
 * Central place to define enum values used across the database
 * Ensures type safety and consistency throughout the application
 */

/**
 * Product Badge Types
 * Used to mark products with promotional badges
 */
export enum ProductBadgeType {
  NEW = 1,
  SALE = 2,
}

export const ProductBadgeTypeMap = {
  [ProductBadgeType.NEW]: 'new',
  [ProductBadgeType.SALE]: 'sale',
} as const;

export const ProductBadgeReverseMap = {
  'new': ProductBadgeType.NEW,
  'sale': ProductBadgeType.SALE,
  'null': null,
} as const;

/**
 * Get badge label from code
 */
export function getBadgeLabel(code: number | null): string | null {
  if (code === null) return null;
  return ProductBadgeTypeMap[code as ProductBadgeType] || null;
}

/**
 * Get badge code from label
 */
export function getBadgeCode(label: string | null): number | null {
  if (!label) return null;
  return ProductBadgeReverseMap[label as keyof typeof ProductBadgeReverseMap] as number | null;
}

/**
 * User Status Types
 * Defines the possible states for a user account
 */
export enum UserStatusType {
  ACTIVE = 1,
  INACTIVE = 2,
  SUSPENDED = 3,
}

export const UserStatusTypeMap = {
  [UserStatusType.ACTIVE]: 'active',
  [UserStatusType.INACTIVE]: 'inactive',
  [UserStatusType.SUSPENDED]: 'suspended',
} as const;

export const UserStatusReverseMap = {
  'active': UserStatusType.ACTIVE,
  'inactive': UserStatusType.INACTIVE,
  'suspended': UserStatusType.SUSPENDED,
} as const;

/**
 * Get user status label from code
 */
export function getStatusLabel(code: number | null): string | null {
  if (code === null) return null;
  return UserStatusTypeMap[code as UserStatusType] || null;
}

/**
 * Get user status code from label
 */
export function getStatusCode(label: string | null): number | null {
  if (!label) return null;
  return UserStatusReverseMap[label as keyof typeof UserStatusReverseMap] as number | null;
}

/**
 * Product Status Types
 * Defines the possible states for a product
 */
export enum ProductStatusType {
  ACTIVE = 1,
  INACTIVE = 2,
  DISCONTINUED = 3,
}

export const ProductStatusTypeMap = {
  [ProductStatusType.ACTIVE]: 'active',
  [ProductStatusType.INACTIVE]: 'inactive',
  [ProductStatusType.DISCONTINUED]: 'discontinued',
} as const;

export const ProductStatusReverseMap = {
  'active': ProductStatusType.ACTIVE,
  'inactive': ProductStatusType.INACTIVE,
  'discontinued': ProductStatusType.DISCONTINUED,
} as const;

/**
 * Get product status label from code
 */
export function getProductStatusLabel(code: number | null): string | null {
  if (code === null) return null;
  return ProductStatusTypeMap[code as ProductStatusType] || null;
}

/**
 * Get product status code from label
 */
export function getProductStatusCode(label: string | null): number | null {
  if (!label) return null;
  return ProductStatusReverseMap[label as keyof typeof ProductStatusReverseMap] as number | null;
}
