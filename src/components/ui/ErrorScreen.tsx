import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@colors';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function ErrorScreen({ 
  message = 'Ha ocurrido un error',
  onRetry,
  showRetryButton = true
}: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {showRetryButton && onRetry && (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.primary,
  },
  text: {
    fontSize: 18,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.interactive.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.interactive.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});