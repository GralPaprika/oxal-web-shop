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
