import { useEffect, useState } from 'react';

import type { Shift, User } from '@prisma/client';
import { Role } from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';

import { adminGuard } from '../../guards/admin.guard';
import { trpc } from '../../utils/trpc';

const History: NextPage = () => {
  const [history, setHistory] = useState<(Shift & { user: User })[]>([]);
  const [year, setYear] = useState<string>('2023');

  const { data: sessionData } = useSession();
  const { data: historyData } = trpc.shift.findMany.useQuery(
    { year },
    { enabled: sessionData?.user?.role === Role.ADMIN }
  );

  useEffect(() => {
    if (!historyData) return;
    setHistory(historyData);
  }, [historyData]);

  console.log(
    'history ->',
    history.map(h => ({
      id: h.id,
      name: h.user.name,
      type: h.type,
      priority: h.priority,
      start: h.start,
      end: h.end,
      amount: h.amount,
      status: h.status,
    }))
  );

  return <div>History</div>;
};

export default History;

// TODO: Fix eslint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps = adminGuard(async ctx => ({
  props: {},
}));
