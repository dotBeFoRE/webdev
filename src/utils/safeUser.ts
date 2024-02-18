import type { User } from '@prisma/client';

const userToSafeUser = (
  user: User,
  options = {
    includeEmail: false,
  },
) => {
  if (options.includeEmail) {
    const { id, name, image, email } = user;

    return { id, name, image, email };
  }

  const { id, name, image } = user;

  return { id, name, image };
};

export type SafeUser = ReturnType<typeof userToSafeUser>;

export default userToSafeUser;
