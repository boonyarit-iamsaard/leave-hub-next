import { useState } from 'react';

import { Container, Loader, Select, Stack, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import {
  DashboardEntitlement,
  DashboardPriority,
  DashboardShiftHistory,
} from '../../components/dashboard';
import { adminGuard } from '../../guards/admin.guard';
import { useProfileSummary } from '../../hooks/use-profile-summary';
import { trpc } from '../../utils/trpc';

const Profile: NextPage = () => {
  const { isReady, query } = useRouter();
  const { data: sessionData } = useSession();
  const { data: profileData } = trpc.user.profile.useQuery(
    { id: query.id },
    { enabled: sessionData?.user !== undefined }
  );

  const [year, setYear] = useState<string | null>('2023');

  const { entitlements, used, hasANL1, hasANL2 } = useProfileSummary(
    year || '2023',
    query.id
  );

  const years = Array.from({ length: 7 }, (_, i) => dayjs().year() + i - 3);

  if (!isReady) {
    return <Loader variant="dots" sx={{ marginInline: 'auto' }} />;
  }

  if (query.id === undefined || Array.isArray(query.id)) {
    return <div>Profile not found</div>;
  }

  return (
    <Container size="lg" px={0}>
      <Stack>
        <Title>{profileData ? profileData.name : 'Dashboard'}</Title>
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

        {year && profileData?.id && (
          <DashboardShiftHistory year={year} userId={profileData.id} />
        )}
      </Stack>
    </Container>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = adminGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => ({ props: {} })
);
