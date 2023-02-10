import mail from '@sendgrid/mail';

const sendGridApiKey = process.env.SENDGRID_API_KEY;

if (!sendGridApiKey) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

mail.setApiKey(sendGridApiKey);

export default mail;
