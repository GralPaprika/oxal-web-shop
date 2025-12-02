export enum UserRoleType {
  ADMIN = 1,
  CASHIER = 2,
  CLIENT = 3,
}

export const UserRoleTypeMap = {
  [UserRoleType.ADMIN]: 'admin',
  [UserRoleType.CASHIER]: 'cashier',
  [UserRoleType.CLIENT]: 'client',
} as const;

export const UserRoleReverseMap = {
  'admin': UserRoleType.ADMIN,
  'cashier': UserRoleType.CASHIER,
  'client': UserRoleType.CLIENT,
} as const;
