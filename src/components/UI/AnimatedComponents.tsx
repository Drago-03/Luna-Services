import React from 'react';
import { Box } from '@chakra-ui/react';

interface AnimatedBackgroundProps {
  variant?: 'gradient' | 'orbs' | 'minimal';
  children?: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'gradient', 
  children 
}) => {
  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      overflow="hidden"
      background={
        variant === 'gradient' 
          ? 'linear-gradient(-45deg, #0a0a0a, #18181b, #f43f5e, #f59e0b, #eab308, #27272a, #0a0a0a)'
          : variant === 'orbs'
          ? 'radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(234, 179, 8, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0a0a0a 0%, #18181b 50%, #27272a 100%)'
          : '#0a0a0a'
      }
      backgroundSize={variant === 'gradient' ? '400% 400%' : 'cover'}
      css={variant === 'gradient' ? {
        animation: 'gradientMove 15s ease infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      } : undefined}
    >
      {/* Floating Orbs */}
      {variant === 'orbs' && (
        <>
          <Box
            position="absolute"
            top="10%"
            left="10%"
            width="300px"
            height="300px"
            background="radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, transparent 70%)"
            borderRadius="50%"
            filter="blur(40px)"
            css={{
              animation: 'float1 20s ease-in-out infinite',
              '@keyframes float1': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                '33%': { transform: 'translateY(-30px) rotate(120deg)' },
                '66%': { transform: 'translateY(15px) rotate(240deg)' },
              },
            }}
          />
          <Box
            position="absolute"
            top="60%"
            right="10%"
            width="200px"
            height="200px"
            background="radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)"
            borderRadius="50%"
            filter="blur(30px)"
            css={{
              animation: 'float2 25s ease-in-out infinite reverse',
              '@keyframes float2': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                '33%': { transform: 'translateY(-30px) rotate(120deg)' },
                '66%': { transform: 'translateY(15px) rotate(240deg)' },
              },
            }}
          />
          <Box
            position="absolute"
            bottom="20%"
            left="30%"
            width="150px"
            height="150px"
            background="radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%)"
            borderRadius="50%"
            filter="blur(25px)"
            css={{
              animation: 'float3 30s ease-in-out infinite',
              animationDelay: '5s',
              '@keyframes float3': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                '33%': { transform: 'translateY(-30px) rotate(120deg)' },
                '66%': { transform: 'translateY(15px) rotate(240deg)' },
              },
            }}
          />
        </>
      )}

      {/* Grid Pattern Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage="radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)"
        backgroundSize="50px 50px"
        opacity="0.3"
      />

      {/* Content */}
      <Box position="relative" zIndex="1" height="100%">
        {children}
      </Box>
    </Box>
  );
};

// Particle system component
interface ParticleSystemProps {
  count?: number;
  color?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 50, 
  color = 'rgba(244, 63, 94, 0.6)' 
}) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 3;
    
    return (
      <Box
        key={i}
        position="absolute"
        width="2px"
        height="2px"
        background={color}
        borderRadius="50%"
        top={`${Math.random() * 100}%`}
        left={`${Math.random() * 100}%`}
        css={{
          animation: `pulse${i} ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          [`@keyframes pulse${i}`]: {
            '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
            '50%': { opacity: 0.8, transform: 'scale(1.1)' },
          },
        }}
      />
    );
  });

  return (
    <Box position="absolute" top="0" left="0" right="0" bottom="0" pointerEvents="none">
      {particles}
    </Box>
  );
};

// Glass morphism card component
interface GlassCardProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  border?: boolean;
  hover?: boolean;
  [key: string]: any; // Allow any additional props
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blur = 20,
  opacity = 0.1,
  border = true,
  hover = true,
  ...props
}) => {
  return (
    <Box
      background={`rgba(255, 255, 255, ${opacity})`}
      backdropFilter={`blur(${blur}px)`}
      border={border ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'}
      borderRadius="16px"
      transition="all 0.3s ease"
      _hover={hover ? {
        background: `rgba(255, 255, 255, ${opacity + 0.05})`,
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
      } : undefined}
      {...props}
    >
      {children}
    </Box>
  );
};

// Shimmer loading effect
export const ShimmerEffect: React.FC<{ width?: string; height?: string }> = ({
  width = '100%',
  height = '20px'
}) => {
  return (
    <Box
      width={width}
      height={height}
      background="linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)"
      backgroundSize="200% 100%"
      borderRadius="4px"
      css={{
        animation: 'shimmer 2s infinite',
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }}
    />
  );
};

// Gradient text component
interface GradientTextProps {
  children: React.ReactNode;
  gradient?: string;
  [key: string]: any; // Allow any additional props
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 50%, #eab308 100%)',
  ...props
}) => {
  return (
    <Box
      as="span"
      background={gradient}
      backgroundClip="text"
      color="transparent"
      display="inline-block"
      {...props}
    >
      {children}
    </Box>
  );
};
