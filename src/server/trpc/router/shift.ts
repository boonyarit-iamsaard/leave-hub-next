import { Roster, ShiftStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

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
});
