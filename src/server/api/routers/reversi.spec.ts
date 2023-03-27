import type { User } from '@prisma/client';
import { getInitialBoard, exportBoard } from '../../../utils/reversi';
import prisma from '../../__mocks__/db';
import { createInnerTRPCContext } from '../trpc';
import reversiRouter from './reversi';

vi.mock('../../db.ts');

describe('reversi', () => {
  const user: User = {
    id: 'test',
    isBanned: false,
    isModerator: false,
    isAdmin: false,
    name: 'test',
    email: 'test@test.com',
    image: 'test',
    emailVerified: new Date(),
  };

  const board = exportBoard(getInitialBoard());

  describe('create', () => {
    it('Banned users should not be able to create games', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: {
            ...user,
            isBanned: true,
          },
          expires: 'test',
        },
      });

      const caller = reversiRouter.createCaller(ctx);

      await expect(
        caller.createGame(),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"FORBIDDEN"');
    });

    it('Users with too many recent games should not be able to create games', async () => {
      prisma.game.count.mockResolvedValue(3);

      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      const caller = reversiRouter.createCaller(ctx);

      await expect(
        caller.createGame(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        '"You have too many recent games, try again in 5 minutes"',
      );
    });

    it('Users with less than 3 recent games should be able to create games', async () => {
      prisma.game.count.mockResolvedValue(2);
      prisma.game.create.mockResolvedValue({
        id: 'test',
        createdAt: new Date(),
        board: 'test',
        winner: 0,
        whiteId: 'test',
        blackId: 'test',
        current: 2,
      });

      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      const caller = reversiRouter.createCaller(ctx);

      await expect(caller.createGame()).resolves.toBe('test');
    });
  });

  describe('getGame', () => {
    it('Should throw if game not found', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      const ctx = createInnerTRPCContext({
        session: null,
      });

      const caller = reversiRouter.createCaller(ctx);

      await expect(
        caller.getGame({ gameId: 'test' }),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"Game not found"');
    });
  });

  describe('doMove', () => {
    it('Should throw if game not found', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      const caller = reversiRouter.createCaller(ctx);

      await expect(
        caller.doMove({ gameId: 'test', x: 0, y: 0 }),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"Game not found"');
    });
  });

  it('Should throw if the game has ended', async () => {
    prisma.game.findUnique.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board: 'test',
      winner: 2,
      whiteId: 'test',
      blackId: 'test',
      current: 2,
    });

    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = reversiRouter.createCaller(ctx);

    await expect(
      caller.doMove({ gameId: 'test', x: 0, y: 0 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot('"Game has ended"');
  });

  it('Should throw if you are not in the game', async () => {
    prisma.game.findUnique.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: 'nottest',
      blackId: 'nottest',
      current: 2,
    });

    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = reversiRouter.createCaller(ctx);

    await expect(
      caller.doMove({ gameId: 'test', x: 0, y: 0 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot('"Not your game"');
  });

  it('Should throw if it is not your turn', async () => {
    prisma.game.findUnique.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: 'test',
      blackId: 'nottest',
      current: 2,
    });

    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = reversiRouter.createCaller(ctx);

    await expect(
      caller.doMove({ gameId: 'test', x: 0, y: 0 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot('"Not your turn"');
  });

  it('Should throw if the move is invalid', async () => {
    prisma.game.findUnique.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: 'test',
      blackId: 'nottest',
      current: 1,
    });

    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = reversiRouter.createCaller(ctx);

    await expect(
      caller.doMove({ gameId: 'test', x: 0, y: 0 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot('"Invalid move"');
  });

  it('Should join the game if blackId is null and current is black', async () => {
    prisma.game.findUnique.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: 'test',
      blackId: null,
      current: 2,
    });

    prisma.game.update.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: 'test',
      blackId: 'test',
      current: 1,
    });

    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = reversiRouter.createCaller(ctx);

    await expect(
      caller.doMove({ gameId: 'test', x: 3, y: 2 }),
    ).resolves.not.toThrow();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.game.update).toHaveBeenLastCalledWith({
      where: {
        id: 'test',
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.objectContaining({
        blackId: 'test',
      }),
    });
  });

  it('Should join the game if white is null and current is white', async () => {
    prisma.game.findUnique.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: null,
      blackId: 'test',
      current: 1,
    });

    prisma.game.update.mockResolvedValue({
      id: 'test',
      createdAt: new Date(),
      board,
      winner: 0,
      whiteId: 'test',
      blackId: 'test',
      current: 1,
    });

    const ctx = createInnerTRPCContext({
      session: {
        user,
        expires: 'test',
      },
    });

    const caller = reversiRouter.createCaller(ctx);

    await expect(
      caller.doMove({ gameId: 'test', x: 4, y: 2 }),
    ).resolves.not.toThrow();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.game.update).toHaveBeenLastCalledWith({
      where: {
        id: 'test',
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.objectContaining({
        blackId: 'test',
      }),
    });
  });
});
