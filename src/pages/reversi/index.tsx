import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
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

  const button =
    session.status !== 'authenticated' ? (
      <button
        type="button"
        onClick={() => signIn('github')}
        className="mr-1 rounded-md bg-stone-700 p-3 transition-colors hover:bg-stone-600 active:bg-stone-600">
        Log in
      </button>
    ) : (
      <button
        className="mr-1 rounded-md bg-stone-700 p-3 transition-colors hover:bg-stone-600 active:bg-stone-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-stone-700 disabled:active:bg-stone-700 "
        type="button"
        disabled={session.data?.user.isBanned === true}
        onClick={() => createGame.mutate()}>
        Create a game
      </button>
    );

  return (
    <>
      <Head>
        <title>Play Reversi</title>
      </Head>
      <Layout>
        <div className="container rounded bg-stone-800 p-5 md:mx-5">
          <h1 className="mb-3 text-4xl">Reversi</h1>
          <p className="mb-3">
            Reversi is a strategy board game for two players, played on an 8×8
            uncheckered board. There are sixty-four identical game pieces called
            disks, which are light on one side and dark on the other. Players
            take turns placing disks on the board with their assigned color
            facing up. During a play, any disks of the opponent’s color that are
            in a straight line and bounded by the disk just placed and another
            disk of the current player’s color are turned over to the current
            player’s color. The objective of the game is to have the majority of
            disks turned to display one’s color when the last playable empty
            square is filled.
          </p>
          <p className="mb-3">
            You can invite people by sending them the link to your game. Or you
            can play with multiple players on the same device by making a move
            for the opposing side after you have taken your turn.
          </p>
          <div>
            {button}{' '}
            <span className="text-sm text-red-400">
              {session.data?.user.isBanned === true
                ? 'You are banned, you cannot create a game.'
                : createGame.error?.message}
            </span>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ReversiPage;
