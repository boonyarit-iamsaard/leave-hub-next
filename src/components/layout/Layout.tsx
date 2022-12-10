import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import { AppShell, useMantineTheme } from '@mantine/core';

import { useRouter } from 'next/router';
import LayoutHeader from './LayoutHeader';
import LayoutNavbar from './LayoutNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
  const { pathname } = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="md"
      navbar={
        pathname !== '/login' ? (
          <LayoutNavbar open={open} setOpen={setOpen} />
        ) : undefined
      }
      header={
        pathname !== '/login' ? (
          <LayoutHeader open={open} setOpen={setOpen} theme={theme} />
        ) : undefined
      }
    >
      {children}
    </AppShell>
  );
};

export default Layout;
