import { z } from 'zod';
import { createTRPCRouter, protectedAdminProcedure } from '../trpc';

const usersRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany(),
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

      return user;
    }),
});

export default usersRouter;
