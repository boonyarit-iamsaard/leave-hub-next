import { Role, Roster } from '@prisma/client';
import { z } from 'zod';

import { adminProcedure, protectedProcedure, router } from '../trpc';

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
    .input(z.object({ roster: z.nativeEnum(Roster), year: z.string() }))
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
          rosterSequence: {
            where: {
              year: parseInt(input.year),
            },
          },
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
          username: true,
          role: true,
          roster: true,
          entitlements: true,
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
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        role: z.nativeEnum(Role),
        roster: z.nativeEnum(Roster),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          username: input.username,
          name: input.name,
          email: input.email,
          role: input.role,
          roster: input.roster,
        },
      });
    }),
});
