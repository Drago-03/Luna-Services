// Chakra UI v3 compatibility utility
// This provides a simple replacement for useColorModeValue for light theme

export const useColorModeValue = (lightValue: string, darkValue?: string) => {
  // For now, always return light theme values
  // In a real implementation, you would check the color mode
  return lightValue;
};

// Alternative approach using CSS variables or context
export const getColorModeValue = (lightValue: string, darkValue?: string) => {
  return lightValue;
};
