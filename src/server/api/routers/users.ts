import { createTRPCRouter, protectedAdminProcedure } from '../trpc';

const usersRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany(),
  ),
});

export default usersRouter;
