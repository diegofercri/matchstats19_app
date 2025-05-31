/**
 * WebView configuration and constants
 * Defines default settings and behavior for WebView components
 */
export const WEBVIEW_CONFIG = {
  defaultUrl: 'https://staff19torneos.com/',
  allowsInlineMediaPlayback: true,
  allowsFullscreenVideo: true,
  startInLoadingState: true,
  scalesPageToFit: true,
} as const;

/**
 * Validates if a given string is a valid URL
 * 
 * @param url - String to validate as URL
 * @returns True if valid URL, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formats a URL for display purposes by extracting hostname
 * Falls back to original URL if parsing fails
 * 
 * @param url - URL string to format
 * @returns Hostname or original URL if invalid
 */
export const formatUrlForDisplay = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};