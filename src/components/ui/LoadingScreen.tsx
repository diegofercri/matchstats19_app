import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@colors';

/**
 * Props interface for LoadingScreen component
 * Defines customization options for loading indicator appearance
 */
interface LoadingScreenProps {
  size?: 'small' | 'large';
  color?: string;
}

/**
 * Loading screen component for displaying loading states
 * Provides centered activity indicator with customizable size and color
 * Used throughout the app for consistent loading UI during async operations
 * 
 * @param props - Loading screen properties including size and color customization
 * @returns JSX element containing centered activity indicator
 */
export function LoadingScreen({ 
  size = 'large', 
  color = colors.interactive.primary 
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});