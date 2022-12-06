import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import { AppShell, useMantineTheme } from '@mantine/core';

import LayoutHeader from './LayoutHeader';
import LayoutNavbar from './LayoutNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
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
      navbarOffsetBreakpoint="sm"
      navbar={<LayoutNavbar open={open} />}
      header={<LayoutHeader open={open} setOpen={setOpen} theme={theme} />}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
