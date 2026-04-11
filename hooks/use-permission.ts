import { useAuth } from '@/contexts/auth-context';
import { Role } from '@/lib/auth';

export type Action =
  | 'view:dashboard'
  | 'view:map'
  | 'view:projects'
  | 'view:analytics'
  | 'view:constructor'
  | 'view:archive'
  | 'view:export'
  | 'edit:data'
  | 'manage:users'
  | 'view:admin'
  | 'create:scenario'
  | 'edit:scenario'
  | 'approve:scenario'
  | 'compare:scenario';

export function usePermission() {
  const { user } = useAuth();

  const hasRole = (role: Role): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const can = (action: Action): boolean => {
    if (!user) return false;
    if (!user.isActive) return false;

    const isAdmin = hasRole('admin');
    const isExpert = hasRole('expert');

    switch (action) {
      case 'view:dashboard':
      case 'view:map':
      case 'view:projects':
      case 'view:analytics':
      case 'view:constructor':
      case 'view:archive':
      case 'view:export':
      case 'edit:data':
        return isExpert || isAdmin;

      case 'view:admin':
      case 'manage:users':
        return isAdmin;

      case 'create:scenario':
      case 'edit:scenario':
      case 'compare:scenario':
        return isExpert || isAdmin;

      case 'approve:scenario':
        return isAdmin;

      default:
        return false;
    }
  };

  return { can, hasRole, roles: user?.roles ?? [] };
}
