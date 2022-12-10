import type { Dispatch, FC, SetStateAction } from 'react';

import { Navbar } from '@mantine/core';
import { useSession } from 'next-auth/react';

import LayoutNavLinkList from './LayoutNavLinkList';

interface LayoutNavbarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LayoutNavbar: FC<LayoutNavbarProps> = ({ open, setOpen }) => {
  const { data: sessionData } = useSession();

  return sessionData?.user ? (
    <Navbar
      p="md"
      hiddenBreakpoint="md"
      hidden={!open}
      width={{ md: 240, lg: 320 }}
    >
      <LayoutNavLinkList setOpen={setOpen} />
    </Navbar>
  ) : null;
};

export default LayoutNavbar;
