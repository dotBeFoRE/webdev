import type { User } from '@prisma/client';

const userToSafeUser = (user: User) => {
  const { id, name, image } = user;

  return { id, name, image };
};

export type SafeUser = ReturnType<typeof userToSafeUser>;

export default userToSafeUser;
