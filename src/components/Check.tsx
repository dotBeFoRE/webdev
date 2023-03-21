import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from './Layout';

type Props = {
  children: React.ReactNode;
  doRedirect?: boolean;
};

export const NotAuthorized = () => {
  const router = useRouter();

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
};

const ModeratorCheck = ({ children, doRedirect = true }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && doRedirect) {
      void signIn('github', { callbackUrl: router.asPath });
    }
  }, [router.asPath, status, doRedirect]);

  if (
    (session?.user.isAdmin === false && session?.user.isModerator === false) ||
    status === 'unauthenticated'
  ) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
};

export const AdminCheck = ({ children, doRedirect = true }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && doRedirect) {
      void signIn('github', { callbackUrl: router.asPath });
    }
  }, [router.asPath, status, doRedirect]);

  if (session?.user.isAdmin === false || status === 'unauthenticated') {
    return <NotAuthorized />;
  }

  return <>{children}</>;
};

export const LoggedInCheck = ({ children, doRedirect = true }: Props) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && doRedirect) {
      void signIn('github', { callbackUrl: router.asPath });
    }
  }, [router.asPath, status, doRedirect]);

  if (status === 'unauthenticated') {
    return <NotAuthorized />;
  }

  return <>{children}</>;
};

export default ModeratorCheck;
