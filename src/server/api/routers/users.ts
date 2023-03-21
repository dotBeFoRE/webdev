import { z } from 'zod';
import createLog from '../../../utils/auditLogger';
import { createTRPCRouter, protectedAdminProcedure } from '../trpc';

const usersRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany(),
  ),
  get: protectedAdminProcedure.input(z.string()).query(({ ctx, input: id }) =>
    ctx.prisma.user.findUnique({
      where: {
        id,
      },
    }),
  ),
  ban: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          isBanned: true,
        },
      });

      createLog({
        action: 'ban',
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        target: id,
        targetType: 'user',
      });

      return user;
    }),
  unban: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          isBanned: false,
        },
      });

      createLog({
        action: 'unban',
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        target: id,
        targetType: 'user',
      });

      return user;
    }),
});

export default usersRouter;
