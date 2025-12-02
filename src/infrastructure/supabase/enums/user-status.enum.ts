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
