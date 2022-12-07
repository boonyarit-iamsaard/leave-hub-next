import type { Dispatch, FC, SetStateAction } from 'react';

import { Navbar } from '@mantine/core';

import LayoutNavLinkList from './LayoutNavLinkList';

interface LayoutNavbarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LayoutNavbar: FC<LayoutNavbarProps> = ({ open, setOpen }) => {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="md"
      hidden={!open}
      width={{ md: 240, lg: 320 }}
    >
      <LayoutNavLinkList setOpen={setOpen} />
    </Navbar>
  );
};

export default LayoutNavbar;
