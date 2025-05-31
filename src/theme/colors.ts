// theme/colors.ts

/**
 * Color palette definition for the application
 * Contains all color tokens organized by category and usage
 */
export const colors = {
  // Background colors for different surfaces
  background: {
    primary: '#121212',      // Main app background
    secondary: '#1e1e1e',    // Cards and containers background
    tertiary: '#404040',     // Headers and highlighted elements background
    surface: '#202020',      // Interactive elements background
  },
  
  // Text colors for different hierarchy levels
  text: {
    primary: '#ffffff',      // Primary text (pure white)
    secondary: '#e7e7e7',    // Secondary text (very light gray)
    tertiary: '#b8b8b8',     // Tertiary text (medium gray)
    muted: '#9e9e9e',        // Disabled/subtle text
  },
  
  // Border colors for visual separation
  border: {
    primary: '#404040',      // Primary borders
    secondary: '#333333',    // Secondary borders/separators
    muted: '#2a2a2a',        // Subtle borders
  },
  
  // Colors for interactive elements
  interactive: {
    primary: '#d8ff00',      // Primary accent color (yellow-green)
    primaryText: '#000000',  // Text on primary color
    hover: '#333333',        // Hover state
    pressed: '#404040',      // Pressed state
  },
  
  // Status indication colors
  status: {
    success: '#22c55e',      // Green for success
    warning: '#f59e0b',      // Yellow for warnings
    error: '#ef4444',        // Red for errors
    info: '#3b82f6',         // Blue for information
  },
  
  // Semantic colors specific to sports context
  sports: {
    win: '#22c55e',          // Green for wins
    draw: '#f59e0b',         // Yellow for draws
    loss: '#ef4444',         // Red for losses
    position: '#d8ff00',     // Color for highlighted positions
  }
};

/**
 * Helper function to access colors using dot notation
 * Provides safe access to nested color values with fallback
 * 
 * @param path - Dot-separated path to color (e.g., 'background.primary')
 * @returns Hex color value or fallback black color
 */
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let current: any = colors;
  
  for (const key of keys) {
    current = current[key];
    if (!current) {
      return '#000000';
    }
  }
  
  return current;
};

/**
 * Predefined theme configurations for common UI components
 * Provides consistent styling patterns across the application
 */
export const componentThemes = {
  // Theme for cards and containers
  card: {
    background: colors.background.secondary,
    border: colors.border.primary,
    text: colors.text.primary,
  },
  
  // Theme for headers
  header: {
    background: colors.background.tertiary,
    text: colors.text.secondary,
    border: colors.border.primary,
  },
  
  // Theme for primary buttons
  buttonPrimary: {
    background: colors.interactive.primary,
    text: colors.interactive.primaryText,
    border: colors.interactive.primary,
  },
  
  // Theme for secondary buttons
  buttonSecondary: {
    background: colors.background.surface,
    text: colors.text.primary,
    border: colors.border.primary,
  },
  
  // Theme for inputs and selects
  input: {
    background: colors.background.surface,
    text: colors.text.tertiary,
    border: colors.border.primary,
    placeholder: colors.text.muted,
  },
  
  // Theme for tables
  table: {
    headerBackground: colors.background.tertiary,
    headerText: colors.text.secondary,
    rowBackground: colors.background.secondary,
    rowText: colors.text.primary,
    border: colors.border.secondary,
    accent: colors.interactive.primary,
  },
};