import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { adminGuard } from '../../../guards/admin.guard';

import { trpc } from '../../../utils/trpc';

const UserDetail = () => {
  const router = useRouter();
  // TODO: Improve this type assertion
  const id = router.query.id as string;

  const { data: sessionData } = useSession();
  const { data: user } = trpc.user.fineOneById.useQuery(
    { id },
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div>
      <h1>{user?.name}</h1>
    </div>
  );
};

export default UserDetail;

// TODO: Fix eslint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps = adminGuard(async ctx => ({
  props: {},
}));
