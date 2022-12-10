import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getServerAuthSession } from '../server/common/get-server-auth-session';

export const sessionGuard =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session || !session.user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
