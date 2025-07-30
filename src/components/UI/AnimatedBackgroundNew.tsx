import React from 'react';
import { Box } from '@chakra-ui/react';

interface AnimatedBackgroundProps {
  variant?: 'home' | 'auth' | 'dashboard';
  children?: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'home', 
  children 
}) => {
  const getGradient = () => {
    switch (variant) {
      case 'auth':
        return 'radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(234, 179, 8, 0.04) 0%, transparent 50%), linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #1A1A1A 100%)';
      case 'dashboard':
        return 'radial-gradient(circle at 10% 90%, rgba(249, 115, 22, 0.06) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(234, 179, 8, 0.04) 0%, transparent 40%), linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 100%)';
      default:
        return 'radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.06) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.04) 0%, transparent 50%), linear-gradient(45deg, #0A0A0A 0%, #111111 50%, #0F0F0F 100%)';
    }
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      w="100%"
      h="100%"
      background={getGradient()}
      overflow="hidden"
      zIndex={0}
      css={{
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(249, 115, 22, 0.08)',
          backdropFilter: 'blur(10px)',
          animation: 'float 6s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'rgba(234, 179, 8, 0.06)',
          backdropFilter: 'blur(15px)',
          animation: 'pulse 4s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateY(15px) rotate(240deg)' },
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.1)' },
        },
      }}
    >
      {/* Additional floating shapes */}
      <Box
        position="absolute"
        bottom="20%"
        left="20%"
        w="40px"
        h="40px"
        bg="rgba(239, 68, 68, 0.06)"
        backdropFilter="blur(8px)"
        css={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          animation: 'drift 8s ease-in-out infinite',
          '@keyframes drift': {
            '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
            '25%': { transform: 'translateX(100px) translateY(-50px)' },
            '50%': { transform: 'translateX(-50px) translateY(-100px)' },
            '75%': { transform: 'translateX(-100px) translateY(50px)' },
          },
        }}
      />
      
      <Box
        position="absolute"
        top="30%"
        right="30%"
        w="100px"
        h="100px"
        borderRadius="25px"
        bg="rgba(249, 115, 22, 0.04)"
        backdropFilter="blur(20px)"
        transform="rotate(45deg)"
        css={{
          animation: 'glow 5s ease-in-out infinite',
          '@keyframes glow': {
            '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.1)' },
            '25%': { boxShadow: '0 0 40px rgba(234, 179, 8, 0.15)' },
            '50%': { boxShadow: '0 0 60px rgba(239, 68, 68, 0.1)' },
            '75%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.15)' },
          },
        }}
      />

      {children}
    </Box>
  );
};

export default AnimatedBackground;
