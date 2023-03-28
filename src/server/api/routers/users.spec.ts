import type { Audit, User } from '@prisma/client';
import userToSafeUser from '../../../utils/safeUser';
import prisma from '../../__mocks__/db';
import { createInnerTRPCContext } from '../trpc';
import usersRouter from './users';

vi.mock('../../db.ts');

describe('user router', () => {
  beforeEach(() => {
    prisma.audit.create.mockResolvedValue(undefined as unknown as Audit);
  });

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

  describe('get', () => {
    it('Users should be able to view themselves and no one else', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.audit.create.mockResolvedValue(undefined as unknown as Audit);

      const caller = usersRouter.createCaller(ctx);

      await expect(caller.get('test')).resolves.toEqual(userToSafeUser(user));

      await expect(
        caller.get('test2'),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"NOT_FOUND"');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.audit.create).toBeCalledTimes(1);
    });

    it('Moderators should be able to view users other than themselves and themselves', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: {
            ...user,
            isModerator: true,
          },
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      await expect(caller.get('test')).resolves.toEqual(userToSafeUser(user));
      await expect(caller.get('test2')).resolves.toEqual(userToSafeUser(user));
    });
  });

  describe('edit', () => {
    it('Users should be able to edit themselves and no one else', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      await expect(
        caller.edit({ id: 'test', name: 'test2' }),
      ).resolves.not.toThrowError();

      await expect(
        caller.edit({ id: 'test2', name: 'test2' }),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"NOT_FOUND"');
    });

    it('Users are only allowed to edit their own name', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      await caller.edit({
        id: 'test',
        name: 'test2',
        isModerator: true,
        isBanned: false,
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.update).toBeCalledWith({
        where: { id: 'test' },
        data: { name: 'test2' },
      });
    });

    it('Moderators should be able to edit users other than themselves and themselves', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: {
            ...user,
            isModerator: true,
          },
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      await expect(
        caller.edit({ id: 'test', name: 'test2' }),
      ).resolves.not.toThrowError();

      await expect(
        caller.edit({ id: 'test2', name: 'test2' }),
      ).resolves.not.toThrowError();
    });

    it('Only admins should be allowed to promote users to moderators and demote moderators to users', async () => {
      let ctx = createInnerTRPCContext({
        session: {
          user: {
            ...user,
            isModerator: true,
          },
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      let caller = usersRouter.createCaller(ctx);

      await caller.edit({ id: 'test', isModerator: true });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.update).toBeCalledWith({
        where: { id: 'test' },
        data: {},
      });

      ctx = createInnerTRPCContext({
        session: {
          user: {
            ...user,
            isAdmin: true,
          },
          expires: 'test',
        },
      });

      caller = usersRouter.createCaller(ctx);

      await caller.edit({ id: 'test', isModerator: true });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.update).toHaveBeenLastCalledWith({
        where: { id: 'test' },
        data: { isModerator: true },
      });

      await caller.edit({ id: 'test', isModerator: false });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.update).toHaveBeenLastCalledWith({
        where: { id: 'test' },
        data: { isModerator: false },
      });
    });
  });

  describe('delete', () => {
    it('Users should be able to delete themselves and no one else', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user,
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.delete.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      await expect(caller.delete('test')).resolves.not.toThrowError();
      await expect(
        caller.delete('test2'),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"NOT_FOUND"');
    });

    it('Moderators should be able to delete users other than themselves and themselves', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { ...user, isModerator: true },
          expires: 'test',
        },
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.delete.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      await expect(caller.delete('test')).resolves.not.toThrowError();
      await expect(caller.delete('test2')).resolves.not.toThrowError();
    });

    it('Moderators should not be able to delete moderators', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { ...user, isModerator: true },
          expires: 'test',
        },
      });

      prisma.user.delete.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      prisma.user.findUnique.mockResolvedValue({ ...user, isModerator: true });
      await expect(caller.delete('test')).rejects.toThrowError('FORBIDDEN');

      prisma.user.findUnique.mockResolvedValue({ ...user, isAdmin: true });
      await expect(caller.delete('test')).rejects.toThrowError('FORBIDDEN');

      prisma.user.findUnique.mockResolvedValue({
        ...user,
        isAdmin: true,
        isModerator: true,
      });
      await expect(caller.delete('test')).rejects.toThrowError('FORBIDDEN');
    });

    it('Admins should not be able to delete admins', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { ...user, isAdmin: true },
          expires: 'test',
        },
      });

      prisma.user.delete.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      prisma.user.findUnique.mockResolvedValue({ ...user, isAdmin: true });
      await expect(caller.delete('test')).rejects.toThrowError('FORBIDDEN');

      prisma.user.findUnique.mockResolvedValue({
        ...user,
        isAdmin: true,
        isModerator: true,
      });
      await expect(caller.delete('test')).rejects.toThrowError('FORBIDDEN');
    });

    it('Admins should be able to delete moderators and users', async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { ...user, isAdmin: true },
          expires: 'test',
        },
      });

      prisma.user.delete.mockResolvedValue(user);

      const caller = usersRouter.createCaller(ctx);

      prisma.user.findUnique.mockResolvedValue(user);
      await expect(caller.delete('test')).resolves.not.toThrowError();

      prisma.user.findUnique.mockResolvedValue({
        ...user,
        isModerator: true,
      });
      await expect(caller.delete('test')).resolves.not.toThrowError();
    });
  });
});
