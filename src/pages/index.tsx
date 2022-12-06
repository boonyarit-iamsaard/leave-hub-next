import { Card, Container, Stack, Text, Title } from '@mantine/core';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <Container size="md" p="md">
      <Stack>
        <Title align="center">Leave Hub | Bangkok Engineering</Title>
        <Card radius="md" withBorder>
          <Stack>
            <Text align="center">
              {sessionData && (
                <span>Logged in as {sessionData.user?.name}</span>
              )}
              {secretMessage && <span> - {secretMessage}</span>}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Home;
