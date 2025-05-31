import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@colors';

/**
 * Props interface for ReloadButton component
 * Defines callback function for reload action
 */
interface ReloadButtonProps {
  onReload: () => void;
}

/**
 * Reload button component for WebView controls
 * Provides a circular button with reload icon for refreshing WebView content
 * Uses primary interactive color scheme with centered icon
 * 
 * @param props - Reload button properties with reload callback
 * @returns JSX element containing touchable reload button
 */
export const ReloadButton = ({ onReload }: ReloadButtonProps) => (
  <TouchableOpacity 
    onPress={onReload}
    style={styles.button}
  >
    <View style={styles.reloadIcon}>
      <Ionicons 
        name="reload"
        size={24} 
        color={colors.interactive.primaryText} 
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.interactive.primary,
    padding: 12,
    borderRadius: 24,
  },
  reloadIcon: {
    paddingLeft: 2,
  },
});