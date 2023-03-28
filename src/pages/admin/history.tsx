import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Container,
  Flex,
  Loader,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import type { Shift, User } from '@prisma/client';
import { Role } from '@prisma/client';
import { IconSearch, IconX } from '@tabler/icons';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';
import type { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { adminGuard } from '../../guards/admin.guard';
import { trpc } from '../../utils/trpc';

type HistoryRecord = Shift & { user: User };

const History: NextPage = () => {
  const PAGE_SIZE = 10;
  const router = useRouter();
  const yearOptions = Array.from({ length: 7 }, (_, i) => {
    const year = dayjs().year() + i - 3;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  });

  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'start',
    direction: 'asc',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2023');

  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);

  const { data: sessionData } = useSession();
  const { data: historyData, isLoading: loading } =
    trpc.shift.findMany.useQuery(
      { year: selectedYear },
      { enabled: sessionData?.user?.role === Role.ADMIN }
    );

  const columns: DataTableColumn<HistoryRecord>[] = [
    {
      accessor: 'user.name',
      sortable: true,
      ellipsis: true,
    },
    {
      accessor: 'type',
      sortable: true,
      ellipsis: true,
    },
    {
      accessor: 'priority',
      sortable: true,
      ellipsis: true,
    },
    {
      accessor: 'status',
      sortable: true,
      ellipsis: true,
    },
    {
      accessor: 'start',
      sortable: true,
      ellipsis: true,
      render: ({ start }) => dayjs(start).format('YYYY MMMM DD'),
    },
    {
      accessor: 'end',
      sortable: true,
      ellipsis: true,
      render: ({ end }) => dayjs(end).format('YYYY MMMM DD'),
    },
    {
      accessor: 'amount',
      sortable: true,
      ellipsis: true,
      textAlignment: 'right',
    },
    {
      accessor: 'createdAt',
      sortable: true,
      ellipsis: true,
      render: ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  useEffect(() => {
    if (!historyData) return;

    const records = sortBy(historyData, sortStatus.columnAccessor);
    const sortedRecords =
      sortStatus.direction === 'asc' ? records : records.reverse();
    const filteredRecords = sortedRecords.filter(
      ({ user, type, priority, status }) => {
        if (debouncedSearchTerm !== '') {
          return (
            user.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            priority
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            status.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
        }
        return true;
      }
    );

    const paginatedRecords = filteredRecords.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

    setTotalRecords(filteredRecords.length);
    setRecords(paginatedRecords);
  }, [
    debouncedSearchTerm,
    historyData,
    page,
    sortStatus.columnAccessor,
    sortStatus.direction,
  ]);

  return (
    <Container size="lg" px={0}>
      {/* TODO: Implement responsive design */}
      <Stack>
        <Title>History</Title>

        <Flex gap="md" align="flex-end">
          <Select
            label="Year"
            value={selectedYear}
            onChange={year => {
              if (!year) return;
              setSelectedYear(year);
            }}
            data={yearOptions}
          />

          <TextInput
            onChange={e => setSearchTerm(e.currentTarget.value)}
            placeholder="Search by name, type, priority, or status"
            icon={<IconSearch />}
            rightSection={
              <ActionIcon
                radius="xl"
                variant="transparent"
                onClick={() => setSearchTerm('')}
              >
                <IconX />
              </ActionIcon>
            }
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
                pathname: '/roster/edit/[id]',
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

export default History;

// TODO: Fix eslint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps = adminGuard(async ctx => ({
  props: {},
}));
