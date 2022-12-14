import { useEffect, useState } from 'react';

import {
  Container,
  Flex,
  Loader,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import type { Role, Roster } from '@prisma/client';
import { sortBy } from 'lodash';
import type { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MdSearch } from 'react-icons/md';

import { adminGuard } from '../../../guards/admin.guard';
import { trpc } from '../../../utils/trpc';

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

  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: users, isLoading: loading } = trpc.user.findAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'roster',
    direction: 'asc',
  });
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 200);

  const columns: DataTableColumn<UserRecord>[] = [
    {
      accessor: 'name',
      sortable: true,
    },
    {
      accessor: 'roster',
      render: ({ roster }) => {
        return roster.charAt(0).toUpperCase() + roster.slice(1).toLowerCase();
      },
      sortable: true,
    },
    {
      accessor: 'role',
      render: ({ role }) => {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      },
      sortable: true,
    },
  ];

  useEffect(() => {
    if (users) {
      const records = sortBy(users, sortStatus.columnAccessor);
      const filteredRecords = records.filter(
        ({ email, name, roster, role }) => {
          if (debouncedSearchTerm !== '') {
            return (
              email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              roster
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              role.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
          }

          return true;
        }
      );
      const sortedRecords =
        sortStatus.direction === 'asc'
          ? filteredRecords
          : filteredRecords.reverse();
      const paginatedRecords = sortedRecords.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      );

      setRecords(paginatedRecords);
    }
  }, [
    debouncedSearchTerm,
    page,
    sortStatus.columnAccessor,
    sortStatus.direction,
    users,
  ]);

  return (
    <Container size="md" px={0}>
      <Stack>
        <Title>Admin</Title>
        <Flex justify="flex-end">
          {/* TODO: Implement search term clearable */}
          <TextInput
            onChange={e => setSearchTerm(e.currentTarget.value)}
            placeholder="Search by name, email, roster, or role"
            icon={<MdSearch />}
            value={searchTerm}
            sx={{ flexGrow: 1 }}
          />
        </Flex>
        {loading ? (
          <Loader variant="dots" sx={{ marginInline: 'auto' }} />
        ) : (
          <DataTable
            columns={columns}
            mih={records.length === 0 ? 160 : undefined}
            onPageChange={p => setPage(p)}
            onRowClick={({ id }) =>
              router.push({
                pathname: '/admin/users/[id]',
                query: { id },
              })
            }
            onSortStatusChange={setSortStatus}
            page={page}
            records={records}
            recordsPerPage={PAGE_SIZE}
            sortStatus={sortStatus}
            striped
            totalRecords={users?.length ?? 0}
            withBorder
          />
        )}
      </Stack>
    </Container>
  );
};

export default AdminPage;

// TODO: Fix eslint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps = adminGuard(async ctx => ({
  props: {},
}));
