import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { messageSchema } from '../../../schemas/messageSchema';
import mail from '../../../utils/mail';
import { createTRPCRouter, publicProcedure } from '../trpc';

const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

if (!recaptchaSecretKey) {
  throw new Error('RECAPTCHA_SECRET_KEY is not defined');
}

type RecaptchaResponse = {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
};

const toEmail = process.env.SENDGRID_TO_EMAIL;
if (!toEmail) {
  throw new Error('SENDGRID_MAIL_TO is not defined');
}

const fromEmail = process.env.SENDGRID_FROM_EMAIL;
if (!fromEmail) {
  throw new Error('SENDGRID_MAIL_FROM is not defined');
}

const emailName = process.env.SENDGRID_NAME;

const contactRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      messageSchema.extend({
        token: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { token: recaptchaToken, ...message } = input;

      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
        {
          method: 'POST',
        },
      )
        .then((res): Promise<RecaptchaResponse> => res.json())
        .catch(() => null);

      if (!recaptchaResponse)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      if (
        !recaptchaResponse.success ||
        recaptchaResponse.action !== 'contact_form'
      )
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'reCAPTCHA failed',
        });

      if (recaptchaResponse.score < 0.5)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'reCAPTCHA score too low',
        });

      const dbMessage = await ctx.prisma.message
        .create({
          data: message,
        })
        .catch(() => null);

      if (!dbMessage) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      mail
        .send({
          to: toEmail,
          from: {
            email: fromEmail,
            name: emailName,
          },
          subject: `Contact Form - ${message.subject}`,
          text: message.text,
          html: `<p>From: ${message.email}</p><p>Subject: ${message.subject}</p><p>${message.text}</p>`,
        })
        .catch((err) => {
          console.error('Error sending email', err);
          return null;
        });

      return dbMessage;
    }),
});

export default contactRouter;
