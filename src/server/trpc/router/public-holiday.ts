import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

export const publicHolidayRouter = router({
  findMany: protectedProcedure
    .input(z.object({ year: z.string(), month: z.string() }))
    .query(async ({ ctx, input }) => {
      const year = parseInt(input.year);
      const month = parseInt(input.month);

      return await ctx.prisma.publicHoliday.findMany({
        where: {
          date: {
            gte: new Date(year, month - 1, 1),
            lte: new Date(year, month, 0),
          },
        },
        select: {
          id: true,
          date: true,
        },
      });
    }),
});
