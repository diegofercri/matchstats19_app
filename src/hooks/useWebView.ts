import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';

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

export const useWebView = (): UseWebViewReturn => {
  const webViewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');

  const goBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

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