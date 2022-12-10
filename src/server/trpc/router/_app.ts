import { router } from '../trpc';
import { authRouter } from './auth';
import { entitlementRouter } from './entitlement';
import { exampleRouter } from './example';
import { publicHolidayRouter } from './public-holiday';
import { shiftRouter } from './shift';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  example: exampleRouter,
  publicHoliday: publicHolidayRouter,
  shift: shiftRouter,
  entitlement: entitlementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
