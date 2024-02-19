import { createNextApiHandler } from '@trpc/server/adapters/next';

// eslint-disable-next-line import/extensions
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line import/extensions
import { env } from '../../../env.mjs';
import { createTRPCContext } from '../../../server/api/trpc';
import { appRouter } from '../../../server/api/root';
import createLog from '../../../utils/auditLogger';

const trpcHandler = createNextApiHandler({
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

// export API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const vercelUrl = process.env.VERCEL_URL;

  const fullUrl = vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000';

  res.setHeader('Access-Control-Allow-Origin', fullUrl);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return undefined;
  }

  if (env.NODE_ENV === 'production' && req.headers.host !== vercelUrl) {
    createLog({
      user: undefined,
      action: 'trpcError',
      targetType: 'json',
      target: JSON.stringify({
        path: 'host',
        error: 'Invalid host',
        input: req.headers.host,
      }),
    });

    res.status(400).json({ error: 'Invalid host' });
    return undefined;
  }

  if (req.body && req.headers['Content-Type'] !== 'application/json') {
    res.status(400).json({ error: 'Invalid content type' });
    return undefined;
  }

  res.setHeader('Content-Disposition', 'attachment; filename="api.json"');

  return trpcHandler(req, res);
}
