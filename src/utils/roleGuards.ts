import type { User } from '@prisma/client';

export const isModerator = (user: Pick<User, 'isModerator' | 'isAdmin'>) =>
  user.isAdmin || user.isModerator;

export const isAdmin = (user: Pick<User, 'isAdmin'>) => user.isAdmin;

export const isNotBanned = (user: Pick<User, 'isBanned'>) => !user.isBanned;
