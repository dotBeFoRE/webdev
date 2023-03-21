import type { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { editUserSchema } from '../../../schemas/messageSchema';
import createLog from '../../../utils/auditLogger';
import userToSafeUser from '../../../utils/safeUser';
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from '../trpc';

const usersRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany(),
  ),
  get: protectedAdminProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      if (!ctx.session.user.isAdmin && ctx.session.user.id !== id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return userToSafeUser(user);
    }),
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
  edit: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin && ctx.session.user.id !== input.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const newUser: User = {
        ...user,
        name: input.name ?? user.name,
      };

      if (ctx.session.user.isAdmin) {
        newUser.isBanned = input.isBanned ?? user.isBanned;
      }

      console.log(newUser);

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...newUser,
        },
      });

      createLog({
        action: 'edit',
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        target: ctx.session.user.id,
        targetType: 'user',
      });

      return userToSafeUser(updatedUser);
    }),
});

export default usersRouter;
