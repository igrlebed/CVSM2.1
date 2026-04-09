import { useAuth } from '@/contexts/auth-context';
import { Role } from '@/lib/auth';

type Action = 
  | 'view:dashboard'
  | 'view:map'
  | 'edit:scenario'
  | 'approve:scenario'
  | 'manage:users';

export function usePermission() {
  const { user } = useAuth();

  const can = (action: Action): boolean => {
    if (!user) return false;

    switch (action) {
      case 'view:dashboard':
      case 'view:map':
        return ['operator', 'analyst', 'approver', 'admin'].includes(user.role);
      
      case 'edit:scenario':
        return ['analyst', 'approver', 'admin'].includes(user.role);
      
      case 'approve:scenario':
        return ['approver', 'admin'].includes(user.role);
      
      case 'manage:users':
        return user.role === 'admin';
      
      default:
        return false;
    }
  };

  return { can };
}
