import type { Dispatch, FC, SetStateAction } from 'react';

import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { MdOutlineHome, MdOutlineManageAccounts } from 'react-icons/md';

interface LayoutNavLinkListProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const linkList = [
  {
    icon: MdOutlineHome,
    label: 'Home',
    pathname: '/',
  },
  {
    icon: MdOutlineManageAccounts,
    label: 'Admin',
    pathname: '/admin',
  },
];

const LayoutNavLinkList: FC<LayoutNavLinkListProps> = ({ setOpen }) => {
  const { pathname } = useRouter();

  // TODO: Implement protected admin route

  const items = linkList.map(link => (
    <NavLink
      active={link.pathname === pathname}
      component={Link}
      href={link.pathname}
      icon={<link.icon size={16} />}
      key={link.label}
      label={link.label}
      onClick={() => setOpen(false)}
    />
  ));

  return <>{items}</>;
};

export default LayoutNavLinkList;
