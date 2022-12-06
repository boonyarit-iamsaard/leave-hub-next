import type { Role } from '@prisma/client';
import 'next-auth';
import { type DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  // TODO: Verify this is correct implementation
  interface User {
    role: Role;
  }
}

// TODO: Verify this is correct implementation
declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
  }
}
