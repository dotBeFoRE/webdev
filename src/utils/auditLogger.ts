import type { Prisma } from '@prisma/client';
import { prisma } from '../server/db';

const createLog = (auditItem: Prisma.AuditCreateInput) => {
  prisma.audit
    .create({ data: auditItem })
    .catch(() =>
      console.error(new Error('Failed to create audit log entry'), auditItem),
    );
};

export default createLog;
