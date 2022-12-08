import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import { AppShell, useMantineTheme } from '@mantine/core';
import { useSession } from 'next-auth/react';

import LayoutHeader from './LayoutHeader';
import LayoutNavbar from './LayoutNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
  const [open, setOpen] = useState<boolean>(false);
  const { data: sessionData } = useSession();

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
        sessionData?.user && <LayoutNavbar open={open} setOpen={setOpen} />
      }
      header={
        sessionData?.user && (
          <LayoutHeader open={open} setOpen={setOpen} theme={theme} />
        )
      }
    >
      {/* TODO: Fix layout shift caused by header */}
      {children}
    </AppShell>
  );
};

export default Layout;
