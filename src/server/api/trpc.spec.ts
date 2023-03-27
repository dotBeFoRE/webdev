import {
  createInnerTRPCContext,
  createTRPCRouter,
  protectedModeratorProcedure,
  protectedNotBannedProcedure,
  protectedProcedure,
} from './trpc';

const router = createTRPCRouter({
  moderator: protectedModeratorProcedure.query(() => {}),
  protected: protectedProcedure.query(() => {}),
  notBanned: protectedNotBannedProcedure.query(() => {}),
});

const user = {
  id: '1',
  name: 'test',
  email: 'test@test.com',
  image: 'test',
  emailVerified: new Date(),
  isBanned: false,
  isModerator: false,
  isAdmin: false,
};

const bannedUser = {
  ...user,
  isBanned: true,
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
          ...user,
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
          ...user,
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
          ...user,
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
          ...user,
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

describe('protectedProcedure', async () => {
  it('should throw if not logged in', async () => {
    const ctx = createInnerTRPCContext({
      session: null,
    });

    const caller = router.createCaller(ctx);

    await expect(caller.protected()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"UNAUTHORIZED"',
    );
  });

  it('should not throw if logged in', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.protected()).resolves.not.toThrow();
  });
});

describe('protectedNotBannedProcedure', async () => {
  it('should throw if not logged in', async () => {
    const ctx = createInnerTRPCContext({
      session: null,
    });

    const caller = router.createCaller(ctx);

    await expect(caller.notBanned()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"UNAUTHORIZED"',
    );
  });

  it('should throw if banned', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: bannedUser,
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.notBanned()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"FORBIDDEN"',
    );
  });

  it('should not throw if not banned', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = router.createCaller(ctx);

    await expect(caller.notBanned()).resolves.not.toThrow();
  });
});
