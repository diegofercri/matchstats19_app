import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@colors';

interface NavigationButtonsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export const NavigationButtons = ({ 
  canGoBack, 
  canGoForward, 
  onGoBack, 
  onGoForward 
}: NavigationButtonsProps) => (
  <View style={styles.navigationButtons}>
    <TouchableOpacity 
      onPress={onGoBack}
      style={[
        styles.button, 
        styles.backButton,
        !canGoBack && styles.disabledButton
      ]}
      disabled={!canGoBack}
    >
      <Ionicons 
        name="arrow-back" 
        size={24} 
        color={canGoBack ? colors.interactive.primaryText : colors.text.muted} 
      />
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={onGoForward}
      style={[
        styles.button, 
        styles.forwardButton,
        !canGoForward && styles.disabledButton
      ]}
      disabled={!canGoForward}
    >
      <Ionicons 
        name="arrow-forward" 
        size={24} 
        color={canGoForward ? colors.interactive.primaryText : colors.text.muted} 
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.interactive.primary,
    padding: 12,
    borderRadius: 24,
  },
  disabledButton: {
    backgroundColor: colors.background.tertiary,
  },
  backButton: {
    marginRight: 4,
  },
  forwardButton: {
    marginLeft: 4,
  },
});