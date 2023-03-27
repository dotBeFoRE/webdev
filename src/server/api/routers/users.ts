import type { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { editUserSchema } from '../../../schemas/zodSchema';
import createLog from '../../../utils/auditLogger';
import { isAdmin, isModerator } from '../../../utils/roleGuards';
import userToSafeUser from '../../../utils/safeUser';
import {
  createTRPCRouter,
  protectedModeratorProcedure,
  protectedProcedure,
} from '../trpc';

const usersRouter = createTRPCRouter({
  getAll: protectedModeratorProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany(),
  ),
  get: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      if (!isModerator(ctx.session.user) && ctx.session.user.id !== id) {
        // Throw a 404 instead of 403 so the requester doesn't know if the user exists
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
  edit: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (
        !ctx.session.user.isAdmin &&
        !ctx.session.user.isModerator &&
        ctx.session.user.id !== input.id
      ) {
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

      if (isModerator(ctx.session.user)) {
        newUser.isBanned = input.isBanned ?? user.isBanned;
      }

      if (isAdmin(ctx.session.user)) {
        newUser.isModerator = input.isModerator ?? user.isModerator;
      }

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: input.id,
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
        target: JSON.stringify({ from: user, to: updatedUser }),
        targetType: 'fromToJson',
      });

      return userToSafeUser(updatedUser);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      if (
        !ctx.session.user.isAdmin &&
        ctx.session.user.id !== id &&
        !ctx.session.user.isModerator
      ) {
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

      if (
        (ctx.session.user.isModerator &&
          user.isModerator &&
          !ctx.session.user.isAdmin) ||
        (user.isAdmin && ctx.session.user.id !== id)
      ) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      await ctx.prisma.game.deleteMany({
        where: {
          OR: [
            {
              whiteId: id,
            },
            {
              blackId: id,
            },
          ],
        },
      });

      const deletedUser = await ctx.prisma.user.delete({
        where: {
          id,
        },
      });

      createLog({
        action: 'delete',
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        target: JSON.stringify(deletedUser),
        targetType: 'json',
      });

      return userToSafeUser(deletedUser);
    }),
});

export default usersRouter;
