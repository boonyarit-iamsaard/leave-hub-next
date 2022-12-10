import { z } from 'zod';

import { adminProcedure, router } from '../trpc';

export const entitlementRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        year: z.number(),
        amount: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.entitlement.create({
        data: {
          name: input.name,
          year: input.year,
          amount: input.amount,
          user: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        year: z.number(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.entitlement.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          year: input.year,
          amount: input.amount,
        },
      });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.entitlement.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
