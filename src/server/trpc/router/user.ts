import { z } from 'zod';
import { adminProcedure, router } from '../trpc';

export const userRouter = router({
  findAll: adminProcedure.query(async ({ ctx }) => {
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
  fineOneById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
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
