import { useState } from 'react';

import { Container, Select, Stack, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';

import {
  DashboardEntitlement,
  DashboardPriority,
  DashboardShiftHistory,
} from '../components/dashboard';
import { sessionGuard } from '../guards/session.guard';
import { useProfileSummary } from '../hooks/use-profile-summary';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: profile } = trpc.user.profile.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const [year, setYear] = useState<string | null>('2023');
  const { entitlements, used, hasANL1, hasANL2 } = useProfileSummary(
    year || '2023'
  );

  const years = Array.from({ length: 7 }, (_, i) => dayjs().year() + i - 3);

  return (
    <Container size="lg" px={0}>
      <Stack>
        <Title>Dashboard</Title>
        <Select
          label="Year"
          placeholder="Select year"
          value={year}
          data={years.map(year => ({
            label: year.toString(),
            value: year.toString(),
          }))}
          sx={{
            alignSelf: 'flex-start',
          }}
          onChange={setYear}
        />

        <DashboardEntitlement
          entitlements={entitlements}
          used={used}
          year={year}
        />

        {entitlements && (
          <DashboardPriority
            hasANL1={hasANL1}
            hasANL2={hasANL2}
            used={used}
            entitlements={entitlements}
          />
        )}

        {year && profile?.id && (
          <DashboardShiftHistory year={year} userId={profile.id} />
        )}
      </Stack>
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = sessionGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => ({ props: {} })
);
