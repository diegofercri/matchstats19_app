import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationButtons } from '@components/web/NavigationButtons';
import { ReloadButton } from '@components/web/ReloadButton';

/**
 * Props interface for WebViewControls component
 * Defines navigation state and callback functions for WebView controls
 */
interface WebViewControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
}

/**
 * WebView controls overlay component
 * Provides floating navigation and reload controls for WebView interface
 * Positioned as absolute overlay with navigation buttons and reload functionality
 * 
 * @param props - WebView control properties and callback functions
 * @returns JSX element containing navigation and reload controls
 */
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