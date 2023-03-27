import type { User } from '@prisma/client';
import {
  createInnerTRPCContext,
  createTRPCRouter,
  protectedModeratorProcedure,
} from './trpc';

const router = createTRPCRouter({
  moderator: protectedModeratorProcedure.query(() => {}),
});

const partialUser: Omit<User, 'isAdmin' | 'isModerator'> = {
  id: '1',
  name: 'test',
  email: 'test@test.com',
  image: 'test',
  isBanned: false,
  emailVerified: new Date(),
};

describe('protectedModeratorProcedure', async () => {
  it('should throw if not logged in', async () => {
    const ctx = createInnerTRPCContext({
      session: null,
    });

    const caller = router.createCaller(ctx);

    await expect(caller.moderator()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"UNAUTHORIZED"',
    );
  });

  it('should throw if not moderator nor admin', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: {
          ...partialUser,
          isModerator: false,
          isAdmin: false,
        },
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.moderator()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"FORBIDDEN"',
    );
  });

  it('should not throw if moderator', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: {
          ...partialUser,
          isModerator: true,
          isAdmin: false,
        },
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.moderator()).resolves.not.toThrow();
  });

  it('should not throw if admin', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: {
          ...partialUser,
          isModerator: false,
          isAdmin: true,
        },
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.moderator()).resolves.not.toThrow();
  });

  it('should not throw if admin and moderator', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: {
          ...partialUser,
          isModerator: true,
          isAdmin: true,
        },
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.moderator()).resolves.not.toThrow();
  });
});
