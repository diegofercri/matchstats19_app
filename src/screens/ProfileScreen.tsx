import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '@colors';

// Custom Hooks
import { useProfile } from '@hooks/useProfile';

// Services
import { getProfileMenuItems } from '@services/profileService';

// Components
import { ProfileHeader } from '@components/profile/ProfileHeader';
import { ProfileMenu } from '@components/profile/ProfileMenu';
import { LoadingScreen } from '@components/ui/LoadingScreen';
import { ErrorScreen } from '@components/ui/ErrorScreen';

/**
 * Profile screen component for user account management
 * Displays user profile information and provides access to account settings
 */
export default function ProfileScreen() {
  const { profile, loading, error, updateProfile, logout } = useProfile();
  const menuItems = getProfileMenuItems();

  /**
   * Handles edit profile action
   * Currently shows development placeholder alert
   */
  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Editar Perfil', 'Funcionalidad en desarrollo');
  };

  /**
   * Handles menu item press events
   * Routes to appropriate actions based on item ID
   * 
   * @param itemId - Menu item identifier
   */
  const handleMenuItemPress = (itemId: string) => {
    switch (itemId) {
      case 'edit-profile':
        handleEditProfile();
        break;
      case 'favorite-teams':
        Alert.alert('Equipos Favoritos', 'Funcionalidad en desarrollo');
        break;
      case 'notifications':
        Alert.alert('Notificaciones', 'Funcionalidad en desarrollo');
        break;
      case 'language':
        Alert.alert('Idioma', 'Funcionalidad en desarrollo');
        break;
      case 'help':
        Alert.alert('Ayuda', 'Funcionalidad en desarrollo');
        break;
      case 'about':
        Alert.alert('Acerca de', 'Match Stats 19 app v1.0.0');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  /**
   * Handles logout action with confirmation dialog
   * Shows confirmation alert before proceeding with logout
   */
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  // Loading State
  if (loading && !profile) {
    return <LoadingScreen />;
  }

  // Error State
  if (error && !profile) {
    return <ErrorScreen message={error} showRetryButton={false} />;
  }

  // No Profile State
  if (!profile) {
    return <ErrorScreen message="No se pudo cargar el perfil" showRetryButton={false} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader 
          profile={profile}
          onEditPress={handleEditProfile}
        />
        
        <ProfileMenu
          menuItems={menuItems}
          profile={profile}
          onItemPress={handleMenuItemPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
});