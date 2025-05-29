import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileMenuItem } from '@services/profileService';
import { User } from '@types';
import { MenuSection } from '@components/ui/MenuSection';

interface ProfileMenuProps {
  menuItems: ProfileMenuItem[];
  profile: User;
  onItemPress: (itemId: string) => void;
}

export function ProfileMenu({ 
  menuItems, 
  profile, 
  onItemPress 
}: ProfileMenuProps) {
  // Group menu items by section
  const groupedItems = menuItems.reduce((groups, item) => {
    if (!groups[item.section]) {
      groups[item.section] = [];
    }
    groups[item.section].push(item);
    return groups;
  }, {} as Record<string, ProfileMenuItem[]>);

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