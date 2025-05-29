import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationButtons } from '@components/web/NavigationButtons';
import { ReloadButton } from '@components/web/ReloadButton';

interface WebViewControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
}

export function WebViewControls({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onReload
}: WebViewControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <NavigationButtons
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
      />
      <ReloadButton onReload={onReload} />
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});