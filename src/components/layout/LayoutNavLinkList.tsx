import type { Dispatch, FC, SetStateAction } from 'react';

import { NavLink } from '@mantine/core';
import { Role } from '@prisma/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  MdOutlineCalendarViewMonth,
  MdOutlineHome,
  MdOutlineManageAccounts,
} from 'react-icons/md';

interface LayoutNavLinkListProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LayoutNavLinkList: FC<LayoutNavLinkListProps> = ({ setOpen }) => {
  const { pathname } = useRouter();
  const { data: sessionData } = useSession();

  const getDefaultRosterPath = (roster: 'mechanic' | 'engineer') => {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1;

    const year = currentYear < 2023 ? 2023 : currentYear;
    const month = currentYear < 2023 ? 1 : currentMonth;

    return `/roster/${roster}/${year}/${month}`;
  };

  return (
    <>
      <NavLink
        active={pathname === '/'}
        component={Link}
        href="/"
        icon={<MdOutlineHome size={16} />}
        label="Home"
        onClick={() => setOpen(false)}
        variant="filled"
      />
      <NavLink
        active={pathname.includes('/roster')}
        icon={<MdOutlineCalendarViewMonth size={16} />}
        label="Roster"
        variant="filled"
      >
        <NavLink
          href={getDefaultRosterPath('engineer')}
          label="Engineer"
          component={Link}
          onClick={() => setOpen(false)}
          variant="filled"
        />
        <NavLink
          label="Mechanic"
          href={getDefaultRosterPath('mechanic')}
          component={Link}
          onClick={() => setOpen(false)}
          variant="filled"
        />
      </NavLink>
      {/* /change-password */}
      <NavLink
        active={pathname.includes('/change-password')}
        component={Link}
        href="/change-password"
        icon={<MdOutlineManageAccounts size={16} />}
        label="Change Password"
        onClick={() => setOpen(false)}
        variant="filled"
      />
      {sessionData?.user?.role === Role.ADMIN && (
        <NavLink
          active={pathname.includes('/admin')}
          component={Link}
          href="/admin"
          icon={<MdOutlineManageAccounts size={16} />}
          label="Admin"
          onClick={() => setOpen(false)}
          variant="filled"
        />
      )}
    </>
  );
};

export default LayoutNavLinkList;
