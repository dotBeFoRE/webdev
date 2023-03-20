import { createTRPCRouter, protectedAdminProcedure } from '../trpc';

const auditRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.audit.findMany({
      include: {
        user: true,
      },
    }),
  ),
});

export default auditRouter;
