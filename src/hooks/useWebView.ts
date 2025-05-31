import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';

/**
 * Return type interface for useWebView hook
 * Defines all available functions and state values for WebView management
 */
interface UseWebViewReturn {
  webViewRef: React.RefObject<WebView | null>;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  currentUrl: string;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  handleNavigationStateChange: (navState: any) => void;
}

/**
 * Custom hook for managing WebView state and navigation
 * Provides navigation controls, loading state, and URL tracking
 * 
 * @returns Object containing WebView ref, state values, and control functions
 */
export const useWebView = (): UseWebViewReturn => {
  const webViewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');

  /**
   * Navigates back in WebView history if possible
   */
  const goBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  /**
   * Navigates forward in WebView history if possible
   */
  const goForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  /**
   * Reloads the current page in WebView
   */
  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  /**
   * Handles navigation state changes from WebView
   * Updates all navigation-related state values
   * 
   * @param navState - Navigation state object from WebView
   */
  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setIsLoading(navState.loading);
    setCurrentUrl(navState.url);
  };

  return {
    webViewRef,
    canGoBack,
    canGoForward, 
    isLoading,
    currentUrl,
    goBack,
    goForward,
    reload,
    handleNavigationStateChange
  };
};