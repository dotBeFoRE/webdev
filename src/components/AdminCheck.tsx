import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from './Layout';

const AdminCheck: React.FC = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('github', { callbackUrl: router.asPath });
    }
  }, [router.asPath, status]);

  if (session?.user.isAdmin === false) {
    return (
      <>
        <Head>
          <title>Not Authorized</title>
        </Head>
        <Layout>
          <div className="flex flex-col rounded bg-stone-800 p-5 md:mx-5">
            <p className="mb-2">You are not authorized to view this page.</p>
            <button
              type="button"
              className="rounded bg-stone-700 p-2 transition-colors hover:bg-stone-600"
              onClick={() => {
                router.back();
              }}>
              Go Back
            </button>
          </div>
        </Layout>
      </>
    );
  }

  return children;
};

export default AdminCheck;
