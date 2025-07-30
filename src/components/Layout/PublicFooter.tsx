import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Text,
  Link,
  Image,
  Badge,
  Divider,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ExternalLink,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublicFooter() {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Integrations', href: '/integrations-info' },
        { label: 'Store', href: '/store' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Documentation', href: '/docs' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contributing', href: '/contributing' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/docs#api' },
        { label: 'Community', href: '/community' },
        { label: 'Support', href: '/contact' },
        { label: 'Status', href: '/status' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Security', href: '/security' },
        { label: 'Compliance', href: '/compliance' },
      ]
    }
  ];

  const socialLinks = [
    { 
      icon: Github, 
      href: 'https://github.com/luna-services', 
      label: 'GitHub',
      color: '#FFFFFF'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/luna_services', 
      label: 'Twitter',
      color: '#1DA1F2'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/company/luna-services', 
      label: 'LinkedIn',
      color: '#0077B5'
    },
    { 
      icon: Mail, 
      href: 'mailto:hello@luna-services.com', 
      label: 'Email',
      color: '#F97316'
    }
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      window.open(href, '_blank');
    } else if (href.startsWith('/#')) {
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
  };

  return (
    <Box
      bg="rgba(5, 5, 5, 0.98)"
      backdropFilter="blur(20px)"
      borderTop="1px solid rgba(255, 255, 255, 0.05)"
      position="relative"
      zIndex={1}
    >
      <Container maxW="1200px" py={16}>
        <Grid 
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} 
          gap={8}
        >
          {/* Company Info */}
          <VStack spacing={6} align="start" gridColumn={{ base: 'span 1', lg: 'span 1' }}>
            <VStack spacing={4} align="start">
              <HStack spacing={3}>
                <Image 
                  src="/assets/logo.png" 
                  alt="Luna Services" 
                  boxSize="32px"
                  filter="drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))"
                />
                <VStack spacing={0} align="start">
                  <Text fontSize="lg" fontWeight="black" color="white">
                    Luna Services
                  </Text>
                  <Badge 
                    bg="transparent"
                    color="rgba(249, 115, 22, 0.4)"
                    border="1px solid rgba(249, 115, 22, 0.2)"
                    px={1.5}
                    py={0.5}
                    borderRadius="sm"
                    fontSize="8px"
                    fontWeight="medium"
                  >
                    BETA
                  </Badge>
                </VStack>
              </HStack>
              
              <Text 
                color="rgba(255, 255, 255, 0.7)" 
                fontSize="sm" 
                lineHeight="tall"
                maxW="250px"
              >
                Revolutionizing AI development with the Universal Model Context Protocol. 
                Build, deploy, and scale AI-powered applications with unprecedented ease.
              </Text>
            </VStack>

            {/* Social Links */}
            <VStack spacing={3} align="start">
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                color="rgba(255, 255, 255, 0.6)"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Follow Us
              </Text>
              <HStack spacing={3}>
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <IconButton
                      key={social.label}
                      aria-label={social.label}
                      icon={<IconComponent size={18} />}
                      variant="ghost"
                      color="rgba(255, 255, 255, 0.6)"
                      _hover={{ 
                        color: social.color,
                        transform: 'translateY(-2px)',
                        bg: 'rgba(255, 255, 255, 0.05)'
                      }}
                      transition="all 0.3s ease"
                      size="sm"
                      onClick={() => handleNavigation(social.href)}
                    />
                  );
                })}
              </HStack>
            </VStack>
          </VStack>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <VStack key={section.title} spacing={4} align="start">
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                color="white"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {section.title}
              </Text>
              <VStack spacing={2} align="start">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(link.href);
                    }}
                    color="rgba(255, 255, 255, 0.7)"
                    fontSize="sm"
                    _hover={{ 
                      color: '#F97316',
                      textDecoration: 'none',
                      transform: 'translateX(4px)'
                    }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    {link.label}
                    {link.href.startsWith('http') && (
                      <ExternalLink size={12} />
                    )}
                  </Link>
                ))}
              </VStack>
            </VStack>
          ))}
        </Grid>

        <Divider my={8} borderColor="rgba(255, 255, 255, 0.1)" />
        
        {/* Bottom Section */}
        <Flex 
          justify="space-between" 
          align="center" 
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <VStack spacing={2} align={{ base: 'center', md: 'start' }}>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)">
              © 2025 Luna Services. All rights reserved.
            </Text>
            <HStack spacing={1} color="rgba(255, 255, 255, 0.5)" fontSize="sm">
              <Text>Made with</Text>
              <Heart size={14} fill="currentColor" color="#F97316" />
              <Text>for developers worldwide</Text>
            </HStack>
          </VStack>

          <VStack spacing={2} align={{ base: 'center', md: 'end' }}>
            <HStack spacing={4} fontSize="sm" color="rgba(255, 255, 255, 0.5)">
              <Text>Status: </Text>
              <Badge 
                colorScheme="green" 
                variant="subtle"
                size="sm"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box 
                  w={2} 
                  h={2} 
                  bg="green.400" 
                  borderRadius="full"
                  animation="pulse 2s infinite"
                />
                All Systems Operational
              </Badge>
            </HStack>
            <Text fontSize="xs" color="rgba(255, 255, 255, 0.4)">
              Version 1.0.0-beta.1 • Last updated: July 30, 2025
            </Text>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
