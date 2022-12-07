import { router } from '../trpc';
import { adminRouter } from './admin';
import { authRouter } from './auth';
import { exampleRouter } from './example';

export const appRouter = router({
  admin: adminRouter,
  auth: authRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
