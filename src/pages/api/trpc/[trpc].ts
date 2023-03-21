import { createNextApiHandler } from '@trpc/server/adapters/next';

// eslint-disable-next-line import/extensions
import { env } from '../../../env.mjs';
import { createTRPCContext } from '../../../server/api/trpc';
import { appRouter } from '../../../server/api/root';
import createLog from '../../../utils/auditLogger';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError({ path, error, input, ctx }) {
    if (env.NODE_ENV === 'development') {
      console.error(
        `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
      );
    }

    if (path !== 'users.get') {
      createLog({
        user: ctx?.session?.user
          ? {
              connect: {
                id: ctx.session.user.id,
              },
            }
          : undefined,
        action: 'trpcError',
        targetType: 'json',
        target: JSON.stringify({
          path,
          error: error.message,
          input,
          session: ctx?.session,
        }),
      });
    }
  },
});
