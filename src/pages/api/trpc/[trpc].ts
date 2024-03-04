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
  const vercelUrl =
    process.env.VERCEL_URL !== undefined
      ? new URL(`https://${process.env.VERCEL_URL}`)
      : null;
  const customUrl =
    process.env.NEXTAUTH_URL !== undefined
      ? new URL(process.env.NEXTAUTH_URL)
      : null;

  if (env.NODE_ENV === 'production') {
    if (vercelUrl && req.headers.origin === vercelUrl.origin) {
      res.setHeader('Access-Control-Allow-Origin', vercelUrl.origin);
    } else if (customUrl && req.headers.origin === customUrl.origin) {
      res.setHeader('Access-Control-Allow-Origin', customUrl.origin);
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return undefined;
  }

  const allowedOrigins = [vercelUrl, customUrl].filter(
    (url): url is URL => !!url,
  );

  const { referer: rawReferer, origin: rawOrigin } = req.headers;
  const referer = rawReferer && new URL(rawReferer);
  const origin = rawOrigin && new URL(rawOrigin);

  const isSameOriginOrigin =
    origin &&
    allowedOrigins.some(
      (allowedOrigin) => origin.origin === allowedOrigin.origin,
    );

  const isSameOriginReferrer =
    referer &&
    allowedOrigins.some(
      (allowedOrigin) => referer.origin === allowedOrigin.origin,
    );

  const isSameOrigin = isSameOriginOrigin || isSameOriginReferrer;

  if (env.NODE_ENV === 'production' && !isSameOrigin) {
    createLog({
      user: undefined,
      action: 'trpcError',
      targetType: 'json',
      target: JSON.stringify({
        path: 'host',
        error: 'Invalid host',
        input: {
          referer: rawReferer,
          origin: rawOrigin,
        },
        expected: allowedOrigins.map((url) => url.origin).join(' or '),
      }),
    });

    res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid origin' });
    return undefined;
  }

  if (
    req.body &&
    !req.headers['content-type']?.startsWith('application/json')
  ) {
    res
      .status(400)
      .json({ code: 'BAD_REQUEST', message: 'Invalid Content-Type' });
    return undefined;
  }

  res.setHeader('Content-Disposition', 'attachment; filename="api.json"');

  return trpcHandler(req, res);
}
