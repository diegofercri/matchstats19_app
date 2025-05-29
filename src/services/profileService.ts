// Profile configuration and utilities
export const PROFILE_CONFIG = {
  maxAvatarSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  defaultLanguage: 'es',
} as const;

// Profile menu sections
export interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'action';
  section: 'account' | 'preferences' | 'support' | 'danger';
}

export const getProfileMenuItems = (): ProfileMenuItem[] => [
  // Account section
  {
    id: 'edit-profile',
    title: 'Editar Perfil',
    icon: 'person-outline',
    type: 'navigation',
    section: 'account'
  },
  {
    id: 'favorite-teams',
    title: 'Equipos Favoritos',
    icon: 'heart-outline',
    type: 'navigation',
    section: 'account'
  },
  
  // Preferences section
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: 'notifications-outline',
    type: 'navigation',
    section: 'preferences'
  },
  {
    id: 'language',
    title: 'Idioma',
    icon: 'language-outline',
    type: 'navigation',
    section: 'preferences'
  },
  
  // Support section
  {
    id: 'help',
    title: 'Ayuda',
    icon: 'help-circle-outline',
    type: 'navigation',
    section: 'support'
  },
  {
    id: 'about',
    title: 'Acerca de',
    icon: 'information-circle-outline',
    type: 'navigation',
    section: 'support'
  },
  
  // Danger section
  {
    id: 'logout',
    title: 'Cerrar Sesión',
    icon: 'log-out-outline',
    type: 'action',
    section: 'danger'
  }
];

// Utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `Hace ${diffInDays}d`;
};