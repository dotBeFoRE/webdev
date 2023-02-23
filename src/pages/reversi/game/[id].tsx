import Head from 'next/head';
import { useRouter } from 'next/router';
import Board from '../../../components/Board';
import Layout from '../../../components/Layout';
import PlayerCard from '../../../components/PlayerCard';
import { api } from '../../../utils/api';
import { COLOR, colorScore } from '../../../utils/reversi';

const GamePage = () => {
  const router = useRouter();

  const { data: game } = api.reversi.getGame.useQuery({
    gameId: router.query.id as string,
  });

  return (
    <>
      <Head>
        <title>Reversi</title>
      </Head>
      <Layout>
        <div className="flex-1 flex-row p-4">
          <div className="m-auto my-4 flex max-w-2xl justify-around gap-6">
            <PlayerCard
              player={game?.white}
              color={COLOR.WHITE}
              score={game?.board && colorScore(game?.board, COLOR.WHITE)}
            />
            <PlayerCard
              player={game?.black}
              color={COLOR.BLACK}
              score={game?.board && colorScore(game?.board, COLOR.WHITE)}
            />
          </div>
          <Board />
        </div>
      </Layout>
    </>
  );
};

export default GamePage;
