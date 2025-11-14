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
