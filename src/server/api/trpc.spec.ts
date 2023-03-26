import {
  createInnerTRPCContext,
  createTRPCRouter,
  protectedModeratorProcedure,
} from './trpc';

const router = createTRPCRouter({
  moderator: protectedModeratorProcedure.query(() => {
    return 'moderator';
  }),
});

describe('protectedModeratorProcedure', () => {
  it('should throw if not logged in', async () => {
    const ctx = createInnerTRPCContext({
      session: null,
    });

    const caller = router.createCaller(ctx);

    const result = await caller.moderator();

    expect;
  });
});
