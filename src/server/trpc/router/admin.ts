import { adminProcedure, router } from '../trpc';

export const adminRouter = router({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        roster: true,
      },
    });
  }),
});
