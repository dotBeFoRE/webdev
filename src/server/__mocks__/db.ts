import type { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  mockReset(prisma);
});

const prisma = mockDeep<PrismaClient>();
export default prisma;
