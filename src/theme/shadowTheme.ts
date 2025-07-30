import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Modern Shadow UI Color Palette
const colors = {
  // Core brand colors with shadcn/ui inspired palette
  brand: {
    50: '#fef3f2',
    100: '#fee4e2',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',  // Primary red
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  
  // Orange accent
  orange: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a', 
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Primary orange
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Yellow accent
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',  // Primary yellow
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  
  // Dark theme colors
  dark: {
    50: '#18181b',   // Background
    100: '#27272a',  // Card
    200: '#3f3f46',  // Muted
    300: '#52525b',  // Border
    400: '#71717a',  // Muted foreground
    500: '#a1a1aa',  // Foreground
    600: '#d4d4d8',  // Foreground
    700: '#e4e4e7',  // Primary foreground
    800: '#f4f4f5',  // Background
    900: '#fafafa',  // Card
  },

  // Glass effect overlays
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    heavy: 'rgba(255, 255, 255, 0.25)',
    dark: 'rgba(0, 0, 0, 0.1)',
    darkMedium: 'rgba(0, 0, 0, 0.15)',
    darkHeavy: 'rgba(0, 0, 0, 0.25)',
  }
};

// Gradients for backgrounds
const gradients = {
  primary: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 50%, #eab308 100%)',
  secondary: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
  glass: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(245, 158, 11, 0.1) 50%, rgba(234, 179, 8, 0.1) 100%)',
  accent: 'linear-gradient(45deg, #f43f5e 0%, #eab308 100%)',
  dark: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 25%, #27272a 50%, #18181b 75%, #0a0a0a 100%)',
};

// Typography
const fonts = {
  heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
};

// Component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      transition: 'all 0.3s ease',
      _focus: {
        boxShadow: '0 0 0 3px rgba(244, 63, 94, 0.1)',
      },
    },
    variants: {
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        _hover: {
          background: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 25px rgba(244, 63, 94, 0.3)',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
      gradient: {
        background: gradients.primary,
        color: 'white',
        border: 'none',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 25px rgba(244, 63, 94, 0.4)',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
      shadow: {
        background: 'dark.100',
        color: 'dark.600',
        border: '1px solid',
        borderColor: 'dark.300',
        _hover: {
          background: 'dark.200',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    sizes: {
      lg: {
        h: '48px',
        px: '32px',
        fontSize: 'md',
      },
    },
  },
  
  Card: {
    baseStyle: {
      background: 'rgba(39, 39, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(82, 82, 91, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },
    variants: {
      glass: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        _hover: {
          background: 'rgba(255, 255, 255, 0.08)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        },
        transition: 'all 0.3s ease',
      },
      elevated: {
        background: 'dark.100',
        border: '1px solid',
        borderColor: 'dark.300',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },

  Input: {
    variants: {
      glass: {
        field: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          color: 'white',
          _placeholder: {
            color: 'whiteAlpha.600',
          },
          _focus: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.5)',
            boxShadow: '0 0 0 1px rgba(244, 63, 94, 0.2)',
          },
        },
      },
    },
  },

  Badge: {
    baseStyle: {
      borderRadius: '8px',
      fontWeight: 'semibold',
      fontSize: 'xs',
      px: 3,
      py: 1,
    },
    variants: {
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
      },
      gradient: {
        background: gradients.primary,
        color: 'white',
        border: 'none',
      },
    },
  },
};

// Global styles
const styles = {
  global: {
    body: {
      bg: 'dark.50',
      color: 'dark.600',
      fontFamily: 'body',
    },
    '*::placeholder': {
      color: 'dark.400',
    },
    '*, *::before, &::after': {
      borderColor: 'dark.300',
    },
  },
};

// Shadow UI Theme
export const shadowTheme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
    glow: '0 0 20px rgba(244, 63, 94, 0.3)',
  },
});

// Export utilities
export { gradients, colors };
export default shadowTheme;
