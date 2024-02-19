import { createNextApiHandler } from '@trpc/server/adapters/next';

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
  const customUrl = process.env.URL;

  if (env.NODE_ENV === 'production') {
    if (vercelUrl && req.headers.origin === vercelUrl) {
      res.setHeader('Access-Control-Allow-Origin', `https://${vercelUrl}`);
    } else if (customUrl && req.headers.origin === process.env.URL) {
      res.setHeader('Access-Control-Allow-Origin', `https://${customUrl}`);
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return undefined;
  }

  const isSameOrigin =
    req.headers.origin === vercelUrl || req.headers.origin === process.env.URL;

  if (env.NODE_ENV === 'production' && !isSameOrigin) {
    createLog({
      user: undefined,
      action: 'trpcError',
      targetType: 'json',
      target: JSON.stringify({
        path: 'host',
        error: 'Invalid host',
        input: req.headers.host,
        expected: `${vercelUrl ?? ''} or ${process.env.URL ?? ''}`,
      }),
    });

    res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid host' });
    return undefined;
  }

  if (req.body && req.headers['Content-Type'] !== 'application/json') {
    res
      .status(400)
      .json({ code: 'BAD_REQUEST', message: 'Invalid Content-Type' });
    return undefined;
  }

  res.setHeader('Content-Disposition', 'attachment; filename="api.json"');

  return trpcHandler(req, res);
}
