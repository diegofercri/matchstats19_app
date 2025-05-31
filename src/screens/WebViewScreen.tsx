import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@colors';

// Custom Hooks
import { useWebView } from '@hooks/useWebView';

// Services
import { WEBVIEW_CONFIG } from '@services/webViewService';

// Components
import { WebViewControls } from '@components/web/WebViewControls';

/**
 * WebView screen component for displaying web content
 * Provides full-featured web browsing with navigation controls and loading states
 */
export default function WebViewScreen() {
  const {
    webViewRef,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    reload,
    handleNavigationStateChange
  } = useWebView();

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEBVIEW_CONFIG.defaultUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={WEBVIEW_CONFIG.startInLoadingState}
        allowsInlineMediaPlayback={WEBVIEW_CONFIG.allowsInlineMediaPlayback}
        allowsFullscreenVideo={WEBVIEW_CONFIG.allowsFullscreenVideo}
        scalesPageToFit={WEBVIEW_CONFIG.scalesPageToFit}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.interactive.primary} />
          </View>
        )}
      />
      
      <WebViewControls
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={goBack}
        onGoForward={goForward}
        onReload={reload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});