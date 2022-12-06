import type { FC } from 'react';

import { Navbar, Text } from '@mantine/core';

interface LayoutNavbarProps {
  open: boolean;
}

const LayoutNavbar: FC<LayoutNavbarProps> = ({ open }) => {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!open}
      width={{ sm: 240, lg: 320 }}
    >
      <Text>Navbar</Text>
    </Navbar>
  );
};

export default LayoutNavbar;
