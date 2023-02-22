import Head from 'next/head';
import Board from '../../../components/Board';
import Layout from '../../../components/Layout';

const GamePage = () => {
  return (
    <>
      <Head>
        <title>Reversi</title>
      </Head>
      <Layout>
        <div className="flex-1">
          <Board />
        </div>
      </Layout>
    </>
  );
};

export default GamePage;
