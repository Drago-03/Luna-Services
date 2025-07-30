import React from 'react';
import { Box } from '@chakra-ui/react';

const animations = `
  @keyframes lunarOrbit {
    0% { transform: rotate(0deg) translateX(300px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(300px) rotate(-360deg); }
  }

  @keyframes eclipseAnimation {
    0%, 80%, 100% { 
      box-shadow: 
        0 0 100px rgba(249, 115, 22, 0.6),
        0 0 200px rgba(249, 115, 22, 0.4),
        inset 0 0 80px rgba(139, 69, 19, 0.8);
    }
    10%, 70% {
      box-shadow: 
        0 0 150px rgba(139, 69, 19, 0.8),
        0 0 300px rgba(139, 69, 19, 0.6),
        inset 0 0 120px rgba(20, 20, 20, 0.9);
    }
    40% {
      box-shadow: 
        0 0 80px rgba(20, 20, 20, 0.9),
        0 0 160px rgba(20, 20, 20, 0.7),
        inset 0 0 100px rgba(0, 0, 0, 1);
    }
  }

  @keyframes starsAnimation {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  @keyframes shadowAnimation {
    0%, 80%, 100% { 
      transform: scale(1) translateX(0px);
      opacity: 0.3;
    }
    40% {
      transform: scale(1.5) translateX(50px);
      opacity: 0.8;
    }
  }
`;

interface LunarEclipseBackgroundProps {
  variant?: 'landing' | 'dashboard' | 'auth';
  intensity?: 'low' | 'medium' | 'high';
}

const LunarEclipseBackground: React.FC<LunarEclipseBackgroundProps> = ({ 
  variant = 'landing',
  intensity = 'medium'
}) => {
  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'low': return 0.4;
      case 'high': return 0.9;
      default: return 0.6;
    }
  };

  return (
    <>
      <style>{animations}</style>
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        overflow="hidden"
        zIndex={-1}
        opacity={getIntensityOpacity()}
      >
        {/* Space Background */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          background="radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)"
        />

        {/* Animated Stars */}
        {[...Array(100)].map((_, i) => (
          <Box
            key={`star-${i}`}
            position="absolute"
            width="2px"
            height="2px"
            background="white"
            borderRadius="50%"
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            sx={{
              animation: `starsAnimation ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Large Background Stars */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={`big-star-${i}`}
            position="absolute"
            width="4px"
            height="4px"
            background="rgba(255, 255, 255, 0.8)"
            borderRadius="50%"
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            boxShadow="0 0 10px rgba(255, 255, 255, 0.5)"
            sx={{
              animation: `starsAnimation ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Moon Orbit Container */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="600px"
          height="600px"
        >
          {/* Orbiting Moon */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width="80px"
            height="80px"
            borderRadius="50%"
            background="linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #bdbdbd 100%)"
            boxShadow="0 0 100px rgba(249, 115, 22, 0.6), 0 0 200px rgba(249, 115, 22, 0.4)"
            sx={{
              animation: 'lunarOrbit 30s linear infinite, eclipseAnimation 15s ease-in-out infinite',
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: '10%',
              left: '20%',
              width: '20%',
              height: '20%',
              borderRadius: '50%',
              background: 'rgba(169, 169, 169, 0.6)',
            }}
            _after={{
              content: '""',
              position: 'absolute',
              bottom: '20%',
              right: '25%',
              width: '15%',
              height: '15%',
              borderRadius: '50%',
              background: 'rgba(169, 169, 169, 0.4)',
            }}
          />

          {/* Earth Shadow */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="120px"
            height="120px"
            borderRadius="50%"
            background="radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.8) 70%)"
            pointerEvents="none"
            sx={{
              animation: 'shadowAnimation 15s ease-in-out infinite',
            }}
          />
        </Box>

        {/* Central Sun/Earth */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="40px"
          height="40px"
          borderRadius="50%"
          background="linear-gradient(135deg, #F97316 0%, #EAB308 100%)"
          boxShadow="0 0 50px rgba(249, 115, 22, 0.8), 0 0 100px rgba(249, 115, 22, 0.4)"
          zIndex={1}
        />

        {/* Eclipse Glow Effect */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="400px"
          height="400px"
          borderRadius="50%"
          background="radial-gradient(circle, transparent 40%, rgba(249, 115, 22, 0.1) 60%, transparent 80%)"
          pointerEvents="none"
          sx={{
            animation: 'eclipseAnimation 15s ease-in-out infinite',
          }}
        />

        {/* Cosmic Dust */}
        {[...Array(50)].map((_, i) => (
          <Box
            key={`dust-${i}`}
            position="absolute"
            width="1px"
            height="1px"
            background="rgba(249, 115, 22, 0.3)"
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            sx={{
              animation: `starsAnimation ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}

        {/* Gradient Overlay for Content Readability */}
        {variant === 'landing' && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            width="100%"
            height="50%"
            background="linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)"
            pointerEvents="none"
          />
        )}
      </Box>
    </>
  );
};

export default LunarEclipseBackground;
