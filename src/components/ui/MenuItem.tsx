import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@colors';
import { ProfileMenuItem } from '@services/profileService';
import { Profile } from '@types';

/**
 * Props interface for MenuItem component
 * Defines menu item data, profile context, and interaction handlers
 */
interface MenuItemProps {
  item: ProfileMenuItem;
  profile: Profile;
  onPress: (itemId: string) => void;
  isLast?: boolean;
}

/**
 * Menu item component for profile settings
 * Renders individual menu items with icons, text, and appropriate interactive elements
 * Supports different item types (navigation, toggle) and danger styling
 * 
 * @param props - Menu item properties including item data and interaction handlers
 * @returns JSX element containing interactive menu item with icon and controls
 */
export const MenuItem = ({ item, profile, onPress }: MenuItemProps) => {
  const isDangerItem = item.section === 'danger';
  const isToggle = item.type === 'toggle';

  return (
    <Pressable
      style={styles.menuItem}
      onPress={() => !isToggle && onPress(item.id)}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={isDangerItem ? colors.status.error : colors.text.secondary} 
        />
        <Text style={[
          styles.menuItemText,
          isDangerItem && styles.dangerText
        ]}>
          {item.title}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        {isToggle ? (
          <Switch
            thumbColor={colors.interactive.primary}
            trackColor={{
              false: colors.background.tertiary,
              true: colors.interactive.primary + '40'
            }}
          />
        ) : (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.text.muted} 
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: 60,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 16,
    flex: 1,
  },
  dangerText: {
    color: colors.status.error,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});