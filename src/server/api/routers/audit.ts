import { createTRPCRouter, protectedModeratorProcedure } from '../trpc';

const auditRouter = createTRPCRouter({
  getAll: protectedModeratorProcedure.query(({ ctx }) =>
    ctx.prisma.audit.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ),
});

export default auditRouter;
