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

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  const getDefaultRosterPath = (roster: 'mechanic' | 'engineer') => {
    return `/roster/${roster}/${currentYear}/${currentMonth}`;
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
      />
      <NavLink
        active={pathname.includes('/roster')}
        label="Roster"
        icon={<MdOutlineCalendarViewMonth size={16} />}
      >
        <NavLink
          href={getDefaultRosterPath('engineer')}
          label="Engineer"
          component={Link}
          onClick={() => setOpen(false)}
        />
        <NavLink
          label="Mechanic"
          href={getDefaultRosterPath('mechanic')}
          component={Link}
          onClick={() => setOpen(false)}
        />
      </NavLink>
      {sessionData?.user?.role === Role.ADMIN && (
        <NavLink
          active={pathname.includes('/admin')}
          component={Link}
          href="/admin"
          icon={<MdOutlineManageAccounts size={16} />}
          label="Admin"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default LayoutNavLinkList;
