import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import type { PlayerColor } from '../utils/reversi';
import { doMove, isOnBoard, isValidMove } from '../utils/reversi';

type Props = {
  x: number;
  y: number;
};

const Piece = ({ x, y }: Props) => {
  const router = useRouter();
  const session = useSession();

  const gameId = typeof router.query.id === 'string' ? router.query.id : '';

  const { data: game } = api.reversi.getGame.useQuery(
    {
      gameId,
    },
    { enabled: !!router.query.id, refetchInterval: 1000 },
  );

  const context = api.useContext();
  const mutation = api.reversi.doMove.useMutation({
    onMutate: async (moveInfo) => {
      if (!game) return;
      await context.reversi.getGame.cancel({ gameId: moveInfo.gameId });

      const result = doMove(
        game.board,
        x,
        y,
        game.currentPlayer as PlayerColor,
      );

      context.reversi.getGame.setData(
        { gameId: moveInfo.gameId },
        {
          ...game,
          board: result?.board || game.board,
          currentPlayer: result?.nextPlayer ?? game.currentPlayer,
          winner: result?.winner ?? game.winner,
        },
      );
    },
    async onSuccess(data) {
      await context.reversi.getGame.cancel({ gameId: data.id });
      context.reversi.getGame.setData({ gameId: data.id }, data);
    },
  });

  const sendMove = () => {
    mutation.mutate({ x, y, gameId });
  };

  if (!game || !isOnBoard(y) || !isOnBoard(x)) return null;
  const piece = game.board[y][x];

  if (piece === 1) return <div className="h-full rounded-full bg-stone-200" />;
  if (piece === 2) return <div className="h-full rounded-full bg-stone-900" />;

  const yourTurn =
    session.data?.user.id !== undefined &&
    ((game.currentPlayer === 1 &&
      (game.white === null || session.data.user.id === game.white?.id)) ||
      (game.currentPlayer === 2 &&
        (game.black === null || session.data.user.id === game.black?.id)));

  if (
    game.currentPlayer === 1 &&
    isValidMove(game.board, x, y, game.currentPlayer) &&
    yourTurn
  )
    return (
      <button
        onClick={sendMove}
        aria-label="Do move"
        type="button"
        className="block h-full w-full rounded-full bg-stone-200 opacity-50 hover:bg-stone-100"
      />
    );
  if (
    game.currentPlayer === 2 &&
    isValidMove(game.board, x, y, game.currentPlayer) &&
    yourTurn
  )
    return (
      <button
        onClick={sendMove}
        aria-label="Do move"
        type="button"
        className="block h-full w-full rounded-full bg-stone-800 opacity-50 hover:bg-stone-900"
      />
    );

  return null;
};

export default Piece;
