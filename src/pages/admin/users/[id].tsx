import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';

const UserDetail = () => {
  const router = useRouter();
  // TODO: Improve this type assertion
  const id = router.query.id as string;

  const { data: sessionData } = useSession();
  const { data: user } = trpc.user.fineOneById.useQuery(
    { id },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <div>
      <h1>{user?.name}</h1>
    </div>
  );
};

export default UserDetail;
