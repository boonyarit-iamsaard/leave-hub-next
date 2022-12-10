import { useEffect, useState } from 'react';

import {
  Card,
  Container,
  Grid,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { Entitlement } from '@prisma/client';
import dayjs from 'dayjs';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';

import { DashboardShiftHistory } from '../components/dashboard';
import { sessionGuard } from '../guards/session.guard';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: profile } = trpc.user.profile.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [year, setYear] = useState<string | null>('2023');

  const years = Array.from({ length: 7 }, (_, i) => dayjs().year() + i - 3);

  useEffect(() => {
    if (profile?.entitlements && year) {
      setEntitlements(
        profile.entitlements.filter(
          entitlement => entitlement.year === parseInt(year, 10)
        )
      );
    }
  }, [profile, year]);

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

        <Title order={2}>Entitlements</Title>
        <Grid>
          {entitlements.length > 0 ? (
            entitlements.map(({ id, name, amount }) => (
              <Grid.Col key={id} span={4}>
                <Card radius="md" withBorder>
                  <Stack>
                    <Text align="center">
                      <span>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </span>
                    </Text>
                    <Text align="center">
                      <span>{amount}</span>
                    </Text>
                    <Text align="center" size="sm">
                      <span>Days</span>
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))
          ) : (
            <Grid.Col>
              <Card radius="md" withBorder>
                <Text>No {year} entitlements found</Text>
              </Card>
            </Grid.Col>
          )}
        </Grid>
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
