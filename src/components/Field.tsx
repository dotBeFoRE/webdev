import { useRouter } from 'next/router';
import { api } from '../utils/api';
import { isOnBoard } from '../utils/reversi';
import Piece from './Piece';

type Props = {
  x: number;
  y: number;
};

const Field = ({ x, y }: Props) => {
  const router = useRouter();
  const { data: game } = api.reversi.getGame.useQuery(
    {
      gameId: typeof router.query.id === 'string' ? router.query.id : '',
    },
    { enabled: !!router.query.id },
  );

  if (!game || !isOnBoard(y) || !isOnBoard(x))
    return <span className="bg-green-600" />;

  return (
    <span className="bg-green-600 p-2">
      <Piece x={x} y={y} />
    </span>
  );
};

export default Field;
