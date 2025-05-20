export const theme = {
  colors: {
    primary: '#00AA00',
    primaryLight: '#e6f7e6',
    secondary: '#202224',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    textPrimary: '#000000',
    textSecondary: '#202224',
    warning: '#FF0000',
    inputBg: '#f8f9fa',
    border: '#e0e0e0',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: '0.2s ease-in-out',
  },
} as const;

export type Theme = typeof theme; 