import { Roster, ShiftPriority, ShiftStatus, ShiftType } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

import { adminProcedure, protectedProcedure, router } from '../trpc';

export const shiftRouter = router({
  findManyByRoster: protectedProcedure
    .input(
      z.object({
        roster: z.nativeEnum(Roster),
        year: z.string(),
        month: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.shift.findMany({
        where: {
          user: {
            roster: input.roster,
          },
          status: {
            not: ShiftStatus.REJECTED,
          },
          start: {
            // Greater than or equal to the first day of the previous month
            gte: dayjs(`${input.year}-${input.month}-01`)
              .subtract(1, 'month')
              .startOf('month')
              .toDate(),
          },
          end: {
            // Less than or equal to the last day of the next month
            lte: dayjs(`${input.year}-${input.month}-01`)
              .add(1, 'month')
              .endOf('month')
              .toDate(),
          },
        },
        include: {
          // TODO: Exclude password
          user: true,
        },
      });
    }),

  findManyByUser: protectedProcedure
    .input(
      z.object({
        year: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.shift.findMany({
        where: {
          user: {
            id: input.userId,
          },
          status: {
            not: ShiftStatus.REJECTED,
          },
          type: {
            not: ShiftType.OFF,
          },
          start: {
            gte: dayjs(`${input.year}-01-01T00:00:00.000Z`).toDate(),
          },
          end: {
            lte: dayjs(`${input.year}-12-31T23:59:59.999Z`).toDate(),
          },
        },
      });
    }),

  findMany: adminProcedure
    .input(
      z.object({
        year: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.shift.findMany({
        where: {
          start: {
            gte: dayjs(`${input.year}-01-01T00:00:00.000Z`).toDate(),
          },
          end: {
            lte: dayjs(`${input.year}-12-31T23:59:59.999Z`).toDate(),
          },
          type: {
            not: ShiftType.OFF,
          },
        },
        include: {
          user: true,
        },
      });
    }),

  findOneById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.shift.findUnique({
        where: {
          id: input.id,
        },
        // TODO: Exclude password
        include: {
          user: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        start: z.date(),
        end: z.date(),
        type: z.nativeEnum(ShiftType),
        priority: z.nativeEnum(ShiftPriority),
        status: z.nativeEnum(ShiftStatus).default(ShiftStatus.PENDING),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.shift.create({
        data: {
          start: input.start,
          end: input.end,
          status: input.status,
          type: input.type,
          priority: input.priority,
          amount: input.amount,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  getUsageSummary: protectedProcedure
    .input(
      z.object({
        year: z.string(),
        id: z.string().or(z.string().array()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const groupByPriority = await ctx.prisma.shift.groupBy({
        by: ['priority', 'type'],
        where: {
          user: {
            id: typeof input.id === 'string' ? input.id : ctx.session.user.id,
          },
          start: {
            gte: dayjs(`${input.year}-01-01T00:00:00.000Z`).toDate(),
          },
          end: {
            lte: dayjs(`${input.year}-12-31T23:59:59.999Z`).toDate(),
          },
          status: {
            not: ShiftStatus.REJECTED,
          },
          type: {
            not: ShiftType.OFF,
          },
        },
        _count: {
          priority: true,
        },
        _sum: {
          amount: true,
        },
      });

      return groupByPriority;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        start: z.date(),
        end: z.date(),
        type: z.nativeEnum(ShiftType),
        priority: z.nativeEnum(ShiftPriority),
        status: z.nativeEnum(ShiftStatus),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.shift.update({
        where: {
          id: input.id,
        },
        data: {
          start: input.start,
          end: input.end,
          status: input.status,
          type: input.type,
          priority: input.priority,
          amount: input.amount,
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.shift.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
