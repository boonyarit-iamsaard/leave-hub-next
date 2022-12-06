import { Card, Container, Stack, Text, Title } from '@mantine/core';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { getServerAuthSession } from '../server/common/get-server-auth-session';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <Container size="md" px={0}>
      <Stack>
        <Title>Dashboard</Title>
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

  // TODO: Consider improving this
  const { id, name, role } = session.user;
  return {
    props: {
      session: {
        user: {
          id,
          name,
          role,
        },
      },
    },
  };
};
