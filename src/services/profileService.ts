/**
 * Interface for profile menu items
 * Defines structure for navigation and action items in profile menu
 */
export interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigation' | 'action';
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