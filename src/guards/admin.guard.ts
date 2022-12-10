import { Role } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getServerAuthSession } from '../server/common/get-server-auth-session';

export const adminGuard =
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

    if (session.user.role !== Role.ADMIN) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
