import { useEffect, useState } from 'react';

import { Container, Stack, Title } from '@mantine/core';
import type { Roster } from '@prisma/client';
import { Role } from '@prisma/client';
import type { DataTableColumn } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useSession } from 'next-auth/react';

import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { trpc } from '../../utils/trpc';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  roster: Roster;
}

const AdminPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const PAGE_SIZE = 10;

  const { data: sessionData } = useSession();
  const { data: users } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<UserRecord[]>([]);

  const columns: DataTableColumn<UserRecord>[] = [
    {
      accessor: 'name',
    },
    {
      accessor: 'roster',
      render: ({ roster }) => {
        return roster.charAt(0).toUpperCase() + roster.slice(1).toLowerCase();
      },
    },
    {
      accessor: 'role',
      render: ({ role }) => {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      },
    },
  ];

  useEffect(() => {
    if (users) {
      setRecords(users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    }
  }, [page, users]);

  return (
    <Container size="md" px={0}>
      <Stack>
        <Title>Admin</Title>
        {/* TODO: Fix no data flash */}
        <DataTable
          columns={columns}
          onPageChange={p => setPage(p)}
          onRowClick={({ email }) => alert(email)}
          page={page}
          records={records}
          recordsPerPage={PAGE_SIZE}
          striped
          totalRecords={users?.length ?? 0}
          withBorder
        />
      </Stack>
    </Container>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerAuthSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.user.role !== Role.ADMIN) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
