import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

interface PublicLayoutProps {
  children: ReactNode;
  headerVariant?: 'transparent' | 'solid';
}

export default function PublicLayout({ children, headerVariant = 'solid' }: PublicLayoutProps) {
  return (
    <Box minH="100vh" bg="#0A0A0A">
      <PublicHeader variant={headerVariant} />
      <Box pt="80px">
        {children}
      </Box>
      <PublicFooter />
    </Box>
  );
}
