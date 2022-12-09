import { Roster } from '@prisma/client';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
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
  findManyByRoster: protectedProcedure
    .input(z.object({ roster: z.nativeEnum(Roster) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          roster: input.roster,
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
  fineOneById: protectedProcedure
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
  profile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        roster: true,
        entitlements: true,
      },
    });
  }),
});
