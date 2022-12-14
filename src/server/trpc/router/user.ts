import { Role, Roster, ShiftStatus, ShiftType } from '@prisma/client';
import { hash, verify } from 'argon2';
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
        entitlements: true,
        // TODO: Implement select shifts by year for summary in admin user list
        shifts: {
          where: {
            status: {
              not: ShiftStatus.REJECTED,
            },
            type: ShiftType.LEAVE,
          },
          select: {
            type: true,
            amount: true,
          },
        },
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
  profile: protectedProcedure
    .input(
      z.object({
        id: z.string().or(z.string().array()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: typeof input.id === 'string' ? input.id : ctx.session.user.id,
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
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          password: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isCurrentPasswordValid = await verify(
        user.password,
        input.currentPassword
      );

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: await hash(input.newPassword),
        },
      });
    }),
  resetPassword: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          password: true,
          ern: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          password: await hash(user.ern),
        },
      });
    }),
});
