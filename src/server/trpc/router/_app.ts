import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { publicHolidayRouter } from './public-holiday';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  example: exampleRouter,
  publicHoliday: publicHolidayRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
