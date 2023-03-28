import type { Prisma } from '@prisma/client';
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
        createLog({
          action: 'userAccessAttempt',
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          targetType: 'user',
          target: id,
        });

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
      if (!isModerator(ctx.session.user) && ctx.session.user.id !== input.id) {
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

      const newUser: Prisma.UserUpdateInput = {};

      if (input.name) {
        newUser.name = input.name;
      }

      if (input.isBanned !== undefined && isModerator(ctx.session.user)) {
        newUser.isBanned = input.isBanned;
      }

      if (input.isModerator !== undefined && isAdmin(ctx.session.user)) {
        newUser.isModerator = input.isModerator;
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
      if (!isModerator(ctx.session.user) && ctx.session.user.id !== id) {
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

      if ((isModerator(user) && !isAdmin(ctx.session.user)) || isAdmin(user)) {
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
