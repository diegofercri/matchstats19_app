/**
 * Profile configuration constants
 * Defines limits and default settings for user profiles
 */
export const PROFILE_CONFIG = {
  maxAvatarSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  defaultLanguage: 'es',
} as const;

/**
 * Interface for profile menu items
 * Defines structure for navigation and action items in profile menu
 */
export interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'action';
  section: 'account' | 'preferences' | 'support' | 'danger';
}

/**
 * Returns array of profile menu items organized by sections
 * Provides complete menu structure for user profile interface
 * 
 * @returns Array of profile menu items with Spanish labels for UI
 */
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

/**
 * Validates email format using regex pattern
 * 
 * @param email - Email string to validate
 * @returns True if email format is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generates initials from a full name
 * Takes first letter of first two words
 * 
 * @param name - Full name string
 * @returns Initials (max 2 characters) in uppercase
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Formats a date into a human-readable "last seen" string
 * Returns relative time in Spanish for UI display
 * 
 * @param date - Date to format
 * @returns Formatted relative time string in Spanish
 */
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