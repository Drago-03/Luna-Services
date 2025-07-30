import { extendTheme } from '@chakra-ui/react';

// Shadow UI color palette with black, orange, yellow, red theme
const colors = {
  brand: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#D97706', // Darker orange
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  accent: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15', // Yellow
    500: '#CA8A04', // Darker yellow
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Red
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  dark: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A', // Dark
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.2)',
    darker: 'rgba(0, 0, 0, 0.4)',
  }
};

const fonts = {
  heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
};

const styles = {
  global: {
    body: {
      bg: 'dark.900',
      color: 'white',
      fontFamily: 'body',
    },
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'brand.500 transparent',
    },
    '*::-webkit-scrollbar': {
      width: '6px',
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'brand.500',
      borderRadius: '3px',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'xl',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        transform: 'translateX(-100%)',
        transition: 'transform 0.6s',
      },
      _hover: {
        transform: 'translateY(-2px)',
        shadow: '0 20px 40px rgba(0,0,0,0.3)',
        _before: {
          transform: 'translateX(100%)',
        },
      },
    },
    variants: {
      glass: {
        bg: 'glass.medium',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: 'whiteAlpha.200',
        color: 'white',
        _hover: {
          bg: 'glass.light',
          borderColor: 'brand.400',
          shadow: '0 20px 40px rgba(249, 115, 22, 0.3)',
        },
      },
      gradient: {
        bgGradient: 'linear(45deg, brand.500, accent.400)',
        color: 'dark.900',
        fontWeight: 'bold',
        _hover: {
          bgGradient: 'linear(45deg, brand.600, accent.500)',
          shadow: '0 20px 40px rgba(249, 115, 22, 0.4)',
        },
      },
      danger: {
        bgGradient: 'linear(45deg, danger.500, danger.400)',
        color: 'white',
        _hover: {
          bgGradient: 'linear(45deg, danger.600, danger.500)',
          shadow: '0 20px 40px rgba(239, 68, 68, 0.4)',
        },
      },
    },
    defaultProps: {
      variant: 'glass',
    },
  },
  Card: {
    baseStyle: {
      bg: 'glass.dark',
      backdropFilter: 'blur(20px)',
      border: '1px solid',
      borderColor: 'whiteAlpha.100',
      borderRadius: '2xl',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
      _hover: {
        borderColor: 'brand.400',
        transform: 'translateY(-5px)',
        boxShadow: '0 35px 60px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  Input: {
    variants: {
      glass: {
        field: {
          bg: 'glass.dark',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
          borderRadius: 'xl',
          color: 'white',
          _placeholder: {
            color: 'whiteAlpha.600',
          },
          _focus: {
            borderColor: 'brand.400',
            boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)',
            bg: 'glass.medium',
          },
        },
      },
    },
    defaultProps: {
      variant: 'glass',
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 'xs',
      letterSpacing: 'wider',
    },
    variants: {
      glass: {
        bg: 'glass.medium',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'whiteAlpha.200',
        color: 'white',
      },
      gradient: {
        bgGradient: 'linear(45deg, brand.500, accent.400)',
        color: 'dark.900',
      },
    },
  },
  Text: {
    baseStyle: {
      color: 'white',
    },
  },
  Heading: {
    baseStyle: {
      color: 'white',
      fontWeight: 'bold',
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const shadowUITheme = extendTheme({
  colors,
  fonts,
  styles,
  components,
  config,
});

export default shadowUITheme;
