import type { User } from '@prisma/client';
import userToSafeUser from './safeUser';

describe('userToSafeUser', () => {
  const user: User = {
    id: 'test',
    email: 'test@tester.com',
    emailVerified: new Date(),
    name: 'Test Tester',
    image: 'test.jpg',
    isAdmin: false,
    isModerator: false,
    isBanned: false,
  };

  it('should return a safe user', () => {
    const safeUser = userToSafeUser(user);

    expect(safeUser).toEqual({
      id: 'test',
      name: 'Test Tester',
      image: 'test.jpg',
    });
  });

  it('should include email if specified', () => {
    const safeUser = userToSafeUser(user, { includeEmail: true });

    expect(safeUser).toEqual({
      id: 'test',
      name: 'Test Tester',
      image: 'test.jpg',
      email: 'test@tester.com',
    });
  });
});
