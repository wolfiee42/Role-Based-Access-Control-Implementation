import { RoleBasedPermissions, RoleHierarchy } from "./config";

interface PermissionContext {
  roles: string[];
  permissions: string[];
}

export class PermissionManager {
  private readonly cachedRoleHierarchy: Map<string, Set<string>> = new Map();
  private readonly cachedRolePermissions: Map<string, Set<string>> = new Map();

  constructor(private readonly context: PermissionContext) {
    // Flatten the role hierarchy and cache it
    Object.keys(RoleHierarchy).forEach((role) => {
      this.cachedRoleHierarchy.set(role, this.computeRoleHierarchy(role));
    });

    // Flatten the role permissions and cache it
    Object.keys(RoleBasedPermissions).forEach((role) => {
      this.cachedRolePermissions.set(role, this.computeRolePermissions(role));
    });
  }

  // method to check if user has permission to perform action
  hasPermission(requiredPermission: string) {
    if (this.context.permissions.includes(requiredPermission)) {
      return true;
    }

    return this.hasPermissionThroughRole(
      this.context.roles,
      requiredPermission
    );
  }

  // method to check if user has any permission to perform action
  hasPermissions(requiredPermissions: string[]) {
    return requiredPermissions.every((permission) =>
      this.hasPermission(permission)
    );
  }

  // method to check if user has any permission to perform action
  hasAnyPermission(requiredPermissions: string[]) {
    return requiredPermissions.some((permission) =>
      this.hasPermission(permission)
    );
  }

  // method to check if user has any role to perform action
  hasRole(requiredRole: string) {
    return this.context.roles.some((role) => {
      const hierarchySet = this.cachedRoleHierarchy.get(role);
      return hierarchySet?.has(requiredRole) || role === requiredRole;
    });
  }

  getMaxRole() {
    return this.context.roles.reduce((maxRole, currentRole) => {
      return this.cachedRoleHierarchy.get(maxRole)?.has(currentRole)
        ? maxRole
        : currentRole;
    }, this.context.roles[0]);
  }

  // algorithm to get role hierarchy
  private computeRoleHierarchy(role: string, visited: Set<string> = new Set()) {
    const result = new Set<string>();

    if (visited.has(role)) {
      return result;
    }

    visited.add(role);

    const inheritedRoles = RoleHierarchy[role] || [];
    inheritedRoles.forEach((inheritedRole) => {
      result.add(inheritedRole);

      const inheritedHierarchy = this.computeRoleHierarchy(
        inheritedRole,
        visited
      );
      inheritedHierarchy.forEach((r) => result.add(r));
    });

    return result;
  }

  // algorithm to get role permission
  private computeRolePermissions(
    role: string,
    visited: Set<string> = new Set()
  ) {
    const result = new Set<string>();

    if (visited.has(role)) {
      return result;
    }

    visited.add(role);

    RoleBasedPermissions[role].forEach((permission) => result.add(permission));

    const hierarchySet = this.cachedRoleHierarchy.get(role);

    hierarchySet?.forEach((inheritedRole) => {
      RoleBasedPermissions[inheritedRole]?.forEach((permisson) =>
        result.add(permisson)
      );
    });

    return result;
  }

  // algorithm to check permission
  private hasPermissionThroughRole(roles: string[], permission: string) {
    return roles.some((role) =>
      this.cachedRolePermissions.get(role)?.has(permission)
    );
  }
}
