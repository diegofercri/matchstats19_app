import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { ProfileMenuItem } from '@services/profileService';
import { Profile } from '@types';
import { MenuItem } from './MenuItem';

/**
 * Props interface for MenuSection component
 * Defines section structure for grouped profile menu items
 */
interface MenuSectionProps {
  title: string;
  items: ProfileMenuItem[];
  profile: Profile;
  onItemPress: (itemId: string) => void;
}

/**
 * Menu section component for organizing profile settings
 * Groups related menu items under section titles for better organization
 * Renders section header and list of menu items with consistent spacing
 * 
 * @param props - Section properties including title, items, and interaction handlers
 * @returns JSX element containing titled section with grouped menu items
 */
export const MenuSection = ({ 
  title, 
  items, 
  profile, 
  onItemPress 
}: MenuSectionProps) => (
  <View style={styles.section}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <View style={styles.sectionContent}>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          profile={profile}
          onPress={onItemPress}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    gap: 4,
  },
});