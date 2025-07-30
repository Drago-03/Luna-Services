import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Text,
  Image,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  Menu as MenuIcon, 
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassButtonNew from '../UI/GlassButtonNew';

interface PublicHeaderProps {
  variant?: 'transparent' | 'solid';
}

export default function PublicHeader({ variant = 'solid' }: PublicHeaderProps) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = variant === 'transparent' 
    ? 'rgba(10, 10, 10, 0.8)' 
    : useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(10, 10, 10, 0.95)');

  const navigationItems = [
    {
      label: 'Product',
      items: [
        { label: 'Features', href: '/#features' },
        { label: 'Integrations', href: '/integrations-info' },
        { label: 'Store', href: '/store' },
        { label: 'Documentation', href: '/docs' },
      ]
    },
    {
      label: 'Resources',
      items: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Contributing', href: '/contributing' },
        { label: 'Contact', href: '/contact' },
        { label: 'Support', href: '/contact' },
      ]
    },
    {
      label: 'Company',
      items: [
        { label: 'About', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ]
    }
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      // Scroll to section on homepage
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(href.substring(2));
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(href.substring(2));
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    onClose();
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bgColor}
      backdropFilter="blur(20px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.05)"
      transition="all 0.3s ease"
    >
      <Container maxW="1200px" py={4}>
        <Flex justify="space-between" align="center">
          {/* Logo */}
          <HStack spacing={3} cursor="pointer" onClick={() => navigate('/')}>
            <Image 
              src="/assets/logo.png" 
              alt="Luna Services" 
              boxSize="32px"
              filter="drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))"
            />
            <Text fontSize="xl" fontWeight="black" color="white">
              Luna Services
            </Text>
            <Badge 
              bg="linear-gradient(135deg, #DC2626, #EF4444)"
              color="white"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
            >
              BETA
            </Badge>
          </HStack>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', lg: 'flex' }}>
            {navigationItems.map((item) => (
              <Menu key={item.label}>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  color="rgba(255, 255, 255, 0.8)"
                  _hover={{ color: '#F97316' }}
                  rightIcon={<ChevronDown size={16} />}
                  fontWeight="medium"
                >
                  {item.label}
                </MenuButton>
                <MenuList
                  bg="rgba(10, 10, 10, 0.95)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  borderRadius="xl"
                >
                  {item.items.map((subItem) => (
                    <MenuItem
                      key={subItem.label}
                      onClick={() => handleNavigation(subItem.href)}
                      bg="transparent"
                      color="rgba(255, 255, 255, 0.8)"
                      _hover={{ 
                        bg: 'rgba(249, 115, 22, 0.1)',
                        color: '#F97316'
                      }}
                    >
                      {subItem.label}
                      {subItem.href.startsWith('http') && (
                        <ExternalLink size={14} style={{ marginLeft: '8px' }} />
                      )}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ))}
          </HStack>

          {/* CTA Buttons */}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
            <GlassButtonNew
              variant="outline-glass"
              size="sm"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </GlassButtonNew>
            <GlassButtonNew
              variant="gradient"
              size="sm"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </GlassButtonNew>
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon size={20} />}
            variant="ghost"
            color="rgba(255, 255, 255, 0.8)"
            display={{ base: 'flex', lg: 'none' }}
            onClick={onOpen}
          />
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent bg="rgba(10, 10, 10, 0.98)" backdropFilter="blur(20px)">
          <DrawerCloseButton color="white" />
          <DrawerHeader>
            <HStack spacing={3}>
              <Image 
                src="/assets/logo.png" 
                alt="Luna Services" 
                boxSize="24px"
              />
              <Text color="white" fontWeight="bold">
                Luna Services
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {navigationItems.map((section) => (
                <VStack key={section.label} spacing={2} align="stretch">
                  <Text 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="rgba(255, 255, 255, 0.6)"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {section.label}
                  </Text>
                  {section.items.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      justifyContent="flex-start"
                      color="rgba(255, 255, 255, 0.8)"
                      _hover={{ 
                        color: '#F97316',
                        bg: 'rgba(249, 115, 22, 0.1)'
                      }}
                      onClick={() => handleNavigation(item.href)}
                    >
                      {item.label}
                      {item.href.startsWith('http') && (
                        <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
                      )}
                    </Button>
                  ))}
                </VStack>
              ))}

              <VStack spacing={3} pt={6} borderTop="1px solid rgba(255, 255, 255, 0.1)">
                <GlassButtonNew
                  variant="outline-glass"
                  size="md"
                  width="full"
                  onClick={() => {
                    navigate('/signin');
                    onClose();
                  }}
                >
                  Sign In
                </GlassButtonNew>
                <GlassButtonNew
                  variant="gradient"
                  size="md"
                  width="full"
                  onClick={() => {
                    navigate('/signup');
                    onClose();
                  }}
                >
                  Sign Up
                </GlassButtonNew>
                <GlassButtonNew
                  variant="gradient"
                  size="md"
                  width="full"
                  onClick={() => {
                    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }}
                >
                  Join Beta Waitlist
                </GlassButtonNew>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
