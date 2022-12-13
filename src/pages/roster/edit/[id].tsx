import { Container, Loader, Stack, Title } from '@mantine/core';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ShiftForm } from '../../../components/shift';

import { sessionGuard } from '../../../guards/session.guard';
import { trpc } from '../../../utils/trpc';

const EditPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();

  //----- Guard clauses start here -----//
  if (!router.isReady) {
    return <Loader variant="dots" style={{ marginInline: 'auto' }} />;
  }
  // TODO: Display a not found message and a link to go back to the roster page
  if (id === undefined || Array.isArray(id)) return <div>Not found</div>;
  //----- Guard clauses end here -----//

  const { data: shiftData, isLoading } = trpc.shift.findOneById.useQuery(
    { id },
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <Container size="xs">
      <Stack>
        {/* TODO: Improve title */}
        <Title>{shiftData?.user.name || 'Edit'}</Title>
        {isLoading && (
          <Loader variant="dots" style={{ marginInline: 'auto' }} />
        )}
        {shiftData && <ShiftForm mode="edit" shift={shiftData} />}
      </Stack>
    </Container>
  );
};

export default EditPage;

export const getServerSideProps: GetServerSideProps = sessionGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => {
    return {
      props: {},
    };
  }
);
