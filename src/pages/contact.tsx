import Head from 'next/head';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Gdpr from '../components/Gdpr';
import ContactForm from '../components/ContactForm';
import Layout from '../components/Layout';

const ContactPage = () => {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    throw new Error('No recaptcha site key found');
  }

  return (
    <>
      <Head>
        <title>CV Ayrton-Taede Tromp</title>
        <meta name="description" content="CV Ayrton-Taede Tromp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GoogleReCaptchaProvider
        reCaptchaKey={recaptchaSiteKey}
        container={{ parameters: { theme: 'dark' } }}>
        <Layout>
          <div className="container m-5 rounded-md bg-stone-800 p-5 lg:max-w-4xl">
            <h1 className="text-center text-3xl">Neem contact op</h1>
            <div className="">
              <ContactForm />
            </div>
          </div>
          <Gdpr />
        </Layout>
      </GoogleReCaptchaProvider>
    </>
  );
};

export default ContactPage;
