// colors/palette.ts
export const colors = {
  // Backgrounds
  background: {
    primary: '#121212',      // Fondo principal de la app
    secondary: '#1e1e1e',    // Fondo de tarjetas y contenedores
    tertiary: '#404040',     // Fondo de headers y elementos destacados
    surface: '#202020',      // Fondo de elementos interactivos
  },
  
  // Text colors
  text: {
    primary: '#ffffff',      // Texto principal (blanco puro)
    secondary: '#e7e7e7',    // Texto secundario (gris muy claro)
    tertiary: '#b8b8b8',     // Texto terciario (gris medio)
    muted: '#9e9e9e',        // Texto deshabilitado/sutil
  },
  
  // Border colors
  border: {
    primary: '#404040',      // Bordes principales
    secondary: '#333333',    // Bordes secundarios/separadores
    muted: '#2a2a2a',        // Bordes sutiles
  },
  
  // Interactive colors
  interactive: {
    primary: '#d8ff00',      // Color de acento principal (amarillo-verde)
    primaryText: '#000000',  // Texto sobre color primario
    hover: '#333333',        // Estado hover
    pressed: '#404040',      // Estado pressed
  },
  
  // Status colors
  status: {
    success: '#22c55e',      // Verde para éxito
    warning: '#f59e0b',      // Amarillo para advertencias
    error: '#ef4444',        // Rojo para errores
    info: '#3b82f6',         // Azul para información
  },
  
  // Semantic colors for sports
  sports: {
    win: '#22c55e',          // Verde para victorias
    draw: '#f59e0b',         // Amarillo para empates
    loss: '#ef4444',         // Rojo para derrotas
    position: '#d8ff00',     // Color para posiciones destacadas
  }
};

// Función helper para usar los colores
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let current: any = colors;
  
  for (const key of keys) {
    current = current[key];
    if (!current) {
      console.warn(`Color path "${path}" not found`);
      return '#000000';
    }
  }
  
  return current;
};

// Themes predefine para diferentes componentes
export const componentThemes = {
  // Theme para cards/contenedores
  card: {
    background: colors.background.secondary,
    border: colors.border.primary,
    text: colors.text.primary,
  },
  
  // Theme para headers
  header: {
    background: colors.background.tertiary,
    text: colors.text.secondary,
    border: colors.border.primary,
  },
  
  // Theme para botones primarios
  buttonPrimary: {
    background: colors.interactive.primary,
    text: colors.interactive.primaryText,
    border: colors.interactive.primary,
  },
  
  // Theme para botones secundarios
  buttonSecondary: {
    background: colors.background.surface,
    text: colors.text.primary,
    border: colors.border.primary,
  },
  
  // Theme para inputs/selects
  input: {
    background: colors.background.surface,
    text: colors.text.tertiary,
    border: colors.border.primary,
    placeholder: colors.text.muted,
  },
  
  // Theme para tablas
  table: {
    headerBackground: colors.background.tertiary,
    headerText: colors.text.secondary,
    rowBackground: colors.background.secondary,
    rowText: colors.text.primary,
    border: colors.border.secondary,
    accent: colors.interactive.primary,
  },
};