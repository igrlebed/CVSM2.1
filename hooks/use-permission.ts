import { useAuth } from '@/contexts/auth-context';

export type Action = 
  | 'view:dashboard'
  | 'view:map'
  | 'view:projects'
  | 'view:archive'
  | 'view:export'
  | 'view:constructor'
  | 'view:scenario'
  | 'edit:scenario'
  | 'create:scenario'
  | 'import:data'
  | 'compare:scenario'
  | 'review:scenario'
  | 'approve:scenario'
  | 'manage:users';

export function usePermission() {
  const { user } = useAuth();

  const can = (action: Action): boolean => {
    if (!user) return false;

    switch (action) {
      case 'view:dashboard':
      case 'view:map':
      case 'view:projects':
        return ['operator', 'analyst', 'approver', 'admin'].includes(user.role);

      case 'view:archive':
      case 'view:export':
        return ['analyst', 'approver', 'admin'].includes(user.role);
      
      case 'view:constructor':
      case 'view:scenario':
      case 'compare:scenario':
        return ['analyst', 'approver', 'admin'].includes(user.role);

      case 'create:scenario':
      case 'edit:scenario':
      case 'import:data':
        return ['analyst', 'admin'].includes(user.role);
      
      case 'review:scenario':
      case 'approve:scenario':
        return ['approver', 'admin'].includes(user.role);
      
      case 'manage:users':
        return user.role === 'admin';
      
      default:
        return false;
    }
  };

  return { can, role: user?.role };
}
