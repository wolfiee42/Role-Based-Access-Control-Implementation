// This setup can be stored in database or direct inside the codebase. Because we
// need the hierarchy during the runtime.

export enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  PREMIUM_USER = "premium_user",
  USER = "user",
}

export enum Permission {
  // Product
  PRODUCT_CREATE = "product:create",
  PRODUCT_READ = "product:read",
  PRODUCT_REVIEW = "product:review",
  PRODUCT_UPDATE = "product:update",
  PRODUCT_DELETE = "product:delete",

  // User
  USER_CREATE = "user:create",
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
}

export const RoleHierarchy: Record<string, string[]> = {
  super_admin: [Role.ADMIN],
  admin: [Role.MANAGER],
  manager: [Role.PREMIUM_USER],
  premium_user: [Role.USER],
  user: [],
} as const;

export const RoleBasedPermissions: Record<string, string[]> = {
  super_admin: [],
  admin: [Permission.USER_DELETE],
  manager: [
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,
  ],
  premium_user: [Permission.PRODUCT_REVIEW],
  user: [Permission.PRODUCT_READ],
} as const;
