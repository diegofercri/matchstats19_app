import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileMenuItem } from '@services/profileService';
import { Profile } from '@types';
import { MenuSection } from '@components/ui/MenuSection';

/**
 * Props interface for ProfileMenu component
 * Defines menu items, profile context, and interaction handler
 */
interface ProfileMenuProps {
  menuItems: ProfileMenuItem[];
  profile: Profile;
  onItemPress: (itemId: string) => void;
}

/**
 * Profile menu component organizing settings into sections
 * Groups menu items by section type and renders them with appropriate titles
 * Provides structured navigation for profile settings and preferences
 * 
 * @param props - Profile menu properties including items and interaction handlers
 * @returns JSX element containing organized menu sections with Spanish titles
 */
export function ProfileMenu({ 
  menuItems, 
  profile, 
  onItemPress 
}: ProfileMenuProps) {
  /**
   * Groups menu items by their section property
   * Creates organized structure for section-based rendering
   */
  const groupedItems = menuItems.reduce((groups, item) => {
    if (!groups[item.section]) {
      groups[item.section] = [];
    }
    groups[item.section].push(item);
    return groups;
  }, {} as Record<string, ProfileMenuItem[]>);

  /**
   * Section title mappings in Spanish for UI display
   * Maps internal section keys to user-friendly Spanish labels
   */
  const sectionTitles = {
    account: 'Cuenta',
    preferences: 'Preferencias',
    support: 'Soporte',
    danger: ''
  };

  return (
    <View style={styles.menuContainer}>
      {Object.entries(groupedItems).map(([section, items]) => (
        <MenuSection
          key={section}
          title={sectionTitles[section as keyof typeof sectionTitles]}
          items={items}
          profile={profile}
          onItemPress={onItemPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});