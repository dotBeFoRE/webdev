import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '@prisma/client';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import type { PlayerColor } from '../../../utils/reversi';
import {
  doMove,
  exportBoard,
  getInitialBoard,
  importBoard,
} from '../../../utils/reversi';
import userToSafeUser from '../../../utils/safeUser';

const hasRecentGames = async (userId: string, prisma: PrismaClient) => {
  const recentGames = await prisma.game.findMany({
    where: {
      OR: [
        {
          whiteId: userId,
        },
        {
          blackId: userId,
        },
      ],
      winner: null,
      createdAt: {
        gte: new Date(new Date().getTime() - 1000 * 60 * 5),
      },
    },
  });

  return recentGames.length >= 3;
};

const reversiRouter = createTRPCRouter({
  createGame: protectedProcedure.mutation(async ({ ctx }) => {
    const board = getInitialBoard();

    const recentGames = await hasRecentGames(ctx.session.user.id, ctx.prisma);

    if (recentGames) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You have too many recent games',
      });
    }

    const game = await ctx.prisma.game.create({
      data: {
        board: exportBoard(board),
        whiteId: ctx.session.user.id,
        current: 1,
      },
    });

    return game.id;
  }),

  getGame: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.prisma.game.findUnique({
        where: {
          id: input.gameId,
        },
        include: {
          white: true,
          black: true,
        },
      });

      if (!game) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Game not found' });
      }

      return {
        id: game.id,
        board: importBoard(game.board),
        winner: game.winner,
        white: game.white && userToSafeUser(game.white),
        black: game.black && userToSafeUser(game.black),
        currentPlayer: game.current,
      };
    }),

  doMove: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        x: z.number().int().min(0).max(7),
        y: z.number().int().min(0).max(7),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.prisma.game.findUnique({
        where: {
          id: input.gameId,
        },
        include: {
          white: true,
          black: true,
        },
      });

      if (!game) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Game not found' });
      }

      if (game.winner) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Game has ended' });
      }

      if (
        game.whiteId !== ctx.session.user.id &&
        game.blackId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not your game',
        });
      }

      const recentGames = await hasRecentGames(ctx.session.user.id, ctx.prisma);

      if (recentGames) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have too many recent games, try again in 5 minutes',
        });
      }

      if (game.current === 1 && game.whiteId !== ctx.session.user.id) {
        if (game.whiteId !== null) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not your turn',
          });
        }

        game.whiteId = ctx.session.user.id;

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
        });

        game.white = user;
      }

      if (game.current === 2 && game.blackId !== ctx.session.user.id) {
        if (game.blackId !== null) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not your turn',
          });
        }

        game.blackId = ctx.session.user.id;

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
        });

        game.black = user;
      }

      const board = importBoard(game.board);

      const result = doMove(
        board,
        input.x,
        input.y,
        game.current as PlayerColor,
      );

      if (!result) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid move',
        });
      }

      await ctx.prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          board: exportBoard(result.board),
          current: result.nextPlayer,
          whiteId: game.whiteId,
          blackId: game.blackId,
          winner: result.winner,
        },
      });

      return {
        id: game.id,
        board: result.board,
        white: game.white && userToSafeUser(game.white),
        black: game.black && userToSafeUser(game.black),
        winner: result.winner,
        currentPlayer: result.nextPlayer,
      };
    }),
});

export default reversiRouter;
