import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Loader, Stack, Title } from '@mantine/core';
import type { Shift } from '@prisma/client';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';
import type { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import { useSession } from 'next-auth/react';
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
    Pick<Shift, 'start' | 'end' | 'amount' | 'type' | 'priority' | 'status'>
  >[] = [
    {
      accessor: 'start',
      render: records => dayjs(records.start).format('YYYY MMMM DD'),
      sortable: true,
    },
    {
      accessor: 'end',
      render: records => dayjs(records.end).format('YYYY MMMM DD'),
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
