import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { ActionIcon, Group, Loader, Stack, Title } from '@mantine/core';
import type { Shift } from '@prisma/client';
import { Role } from '@prisma/client';
import { IconPencil } from '@tabler/icons';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';
import type { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';

interface DashboardShiftHistoryProps {
  year: string;
  userId: string;
}

const DashboardShiftHistory: FC<DashboardShiftHistoryProps> = ({
  year,
  userId,
}) => {
  const PAGE_SIZE = 10;

  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: shifts, isLoading: loading } =
    trpc.shift.findManyByUser.useQuery(
      { year, userId },
      { enabled: sessionData?.user !== undefined }
    );

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Shift[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'start',
    direction: 'desc',
  });

  const columns: DataTableColumn<
    Pick<
      Shift,
      'id' | 'start' | 'end' | 'amount' | 'type' | 'priority' | 'status'
    >
  >[] = [
    {
      accessor: 'start',
      render: ({ start }) => dayjs(start).format('YYYY MMMM DD'),
      sortable: true,
    },
    {
      accessor: 'end',
      render: ({ end }) => dayjs(end).format('YYYY MMMM DD'),
      sortable: true,
    },
    {
      accessor: 'amount',
      sortable: true,
    },
    {
      accessor: 'type',
      sortable: true,
    },
    {
      accessor: 'priority',
      sortable: true,
    },
    {
      accessor: 'status',
      sortable: true,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlignment: 'right',
      hidden: sessionData?.user?.role !== Role.ADMIN,
      render: ({ id }) => (
        <Group spacing={4} position="right" noWrap>
          <ActionIcon
            color="company-secondary"
            onClick={() => router.push(`/roster/edit/${id}`)}
          >
            <IconPencil size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  useEffect(() => {
    if (shifts) {
      const records = sortBy(shifts, sortStatus.columnAccessor);
      const sortedRecords =
        sortStatus.direction === 'asc' ? records : records.reverse();

      const paginatedRecords = sortedRecords.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      );

      setRecords(paginatedRecords);
    }
  }, [page, shifts, sortStatus.columnAccessor, sortStatus.direction]);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Title order={2}>History</Title>
      {loading ? (
        <Loader variant="dots" sx={{ marginInline: 'auto' }} />
      ) : (
        <DataTable
          columns={columns}
          mih={records.length === 0 ? 160 : undefined}
          onPageChange={p => setPage(p)}
          onSortStatusChange={setSortStatus}
          page={page}
          records={records}
          recordsPerPage={PAGE_SIZE}
          sortStatus={sortStatus}
          striped
          totalRecords={records?.length ?? 0}
          withBorder
        />
      )}
    </Stack>
  );
};

export default DashboardShiftHistory;
