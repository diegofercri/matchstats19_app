import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { ProfileMenuItem } from '@services/profileService';
import { User } from '@types';
import { MenuItem } from './MenuItem';

interface MenuSectionProps {
  title: string;
  items: ProfileMenuItem[];
  profile: User;
  onItemPress: (itemId: string) => void;
}

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