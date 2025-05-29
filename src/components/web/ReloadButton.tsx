import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@colors';

interface ReloadButtonProps {
  onReload: () => void;
}

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