import { createTRPCRouter, protectedProcedure } from '../trpc';

const usersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => ctx.prisma.user.findMany()),
});

export default usersRouter;
