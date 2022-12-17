import type { FC } from 'react';
import { useEffect, useState } from 'react';

import {
  Container,
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import type { Entitlement, Role, Roster } from '@prisma/client';
import { ShiftType } from '@prisma/client';
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

// TODO: Improve typing
interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  roster: Roster;
  entitlements: Entitlement[];
  shifts: {
    type: ShiftType;
    amount: number;
  }[];
}

interface UsageColumnProps {
  year: number;
  entitlements: Entitlement[];
  shifts: {
    type: ShiftType;
    amount: number;
  }[];
}

const UsageColumn: FC<UsageColumnProps> = ({ year, entitlements, shifts }) => {
  const entitlement =
    entitlements.find(entitlement => entitlement.year === year)?.amount || 0;
  const leave = shifts.reduce((acc, { type, amount }) => {
    if (type === ShiftType.LEAVE) {
      return acc + amount;
    }

    return acc;
  }, 0);

  return (
    <Flex align="center" gap="md">
      <Text>
        {leave} / {entitlement}
      </Text>
      <Text size="xs" color="gray">
        ({((leave / entitlement) * 100).toFixed(2)}%)
      </Text>
    </Flex>
  );
};

const AdminPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const PAGE_SIZE = 10;
  // TODO: Implement year selection
  const YEAR = 2023;

  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: users, isLoading: loading } = trpc.user.findAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
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
      accessor: 'shifts',
      title: 'Usage',
      render: ({ entitlements, shifts }) => {
        return (
          <UsageColumn
            year={YEAR}
            entitlements={entitlements}
            shifts={shifts}
          />
        );
      },
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

      setTotalRecords(sortedRecords.length);
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
            totalRecords={totalRecords}
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
