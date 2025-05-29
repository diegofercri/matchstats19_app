// WebView configuration and constants
export const WEBVIEW_CONFIG = {
  defaultUrl: 'https://staff19torneos.com/',
  allowsInlineMediaPlayback: true,
  allowsFullscreenVideo: true,
  startInLoadingState: true,
  scalesPageToFit: true,
} as const;

// Utility functions for WebView
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatUrlForDisplay = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};