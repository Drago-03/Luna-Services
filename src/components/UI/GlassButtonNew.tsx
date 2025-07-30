import React from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

interface GlassButtonProps extends ButtonProps {
  variant?: 'glass' | 'gradient' | 'shadow' | 'outline-glass' | 'danger';
  glowColor?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'glass',
  glowColor,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          borderRadius: 'xl',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
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
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
            boxShadow: `0 20px 40px ${glowColor || 'rgba(249, 115, 22, 0.3)'}`,
            borderColor: '#F97316',
            _before: {
              transform: 'translateX(100%)',
            },
          },
          _active: {
            transform: 'translateY(0)',
          },
        };
      
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #F97316 0%, #EAB308 50%, #EF4444 100%)',
          color: '#0F172A',
          border: 'none',
          borderRadius: 'xl',
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _before: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s',
          },
          _hover: {
            background: 'linear-gradient(135deg, #EA580C 0%, #CA8A04 50%, #DC2626 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(249, 115, 22, 0.4)',
            _before: {
              transform: 'translateX(100%)',
            },
          },
          _active: {
            transform: 'translateY(0)',
          },
        };
      
      case 'shadow':
        return {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'xl',
          transition: 'all 0.3s ease',
          _hover: {
            background: 'rgba(0, 0, 0, 0.6)',
            transform: 'translateY(-2px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          _active: {
            transform: 'translateY(0)',
          },
        };
      
      case 'outline-glass':
        return {
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(249, 115, 22, 0.5)',
          color: '#F97316',
          borderRadius: 'xl',
          transition: 'all 0.3s ease',
          _hover: {
            background: 'rgba(249, 115, 22, 0.1)',
            borderColor: '#F97316',
            color: 'white',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(249, 115, 22, 0.2)',
          },
          _active: {
            transform: 'translateY(0)',
          },
        };
      
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 'xl',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          _hover: {
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)',
          },
          _active: {
            transform: 'translateY(0)',
          },
        };
      
      default:
        return {};
    }
  };

  return (
    <ChakraButton
      sx={getVariantStyles()}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

export default GlassButton;
