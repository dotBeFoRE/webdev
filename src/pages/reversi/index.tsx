import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';

const ReversiPage = () => {
  const session = useSession();
  const router = useRouter();

  const createGame = api.reversi.createGame.useMutation({
    onSuccess: (id) => {
      void router.push(`/reversi/game/${id}`);
    },
  });

  if (session.status !== 'authenticated') {
    return (
      <Layout>
        <div>
          <p className="mb-2">You need to be logged in to play Reversi</p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => signIn('github')}
              className="rounded-md bg-stone-800 p-3 transition-colors hover:bg-stone-700 active:bg-stone-700">
              Log in
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        className="rounded-md bg-stone-800 p-3 transition-colors hover:bg-stone-700 active:bg-stone-700"
        type="button"
        onClick={() => createGame.mutate()}>
        Create a game
      </button>
    </Layout>
  );
};

export default ReversiPage;
