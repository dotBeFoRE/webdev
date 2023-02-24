import clsx from 'clsx';
import Image from 'next/image';
import type { RouterOutputs } from '../utils/api';
import type { PlayerColor } from '../utils/reversi';
import { COLOR } from '../utils/reversi';

type Props = {
  player: RouterOutputs['reversi']['getGame']['white' | 'black'] | undefined;
  color: PlayerColor;
  score?: number;
  isWinner?: boolean;
};

const PlayerCard = ({ player, color, score, isWinner }: Props) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-md p-4 sm:flex-1 sm:justify-start',
        {
          'bg-stone-800 text-white': color === COLOR.BLACK,
          'bg-stone-50 text-black': color === COLOR.WHITE,
          'border-2 border-yellow-500': isWinner,
        },
      )}>
      {player && (
        <>
          {player.image && (
            <Image
              alt={player.name ? `${player.name}'s avatar` : 'Avatar'}
              height={40}
              width={40}
              src={player.image}
              className="rounded-full"
            />
          )}
          {player.name && (
            <p className="hidden flex-auto shrink overflow-hidden text-ellipsis whitespace-nowrap break-all sm:block">
              {player.name}
            </p>
          )}
          {score && <p className="justify-self-end">{score}</p>}
        </>
      )}
    </div>
  );
};

export default PlayerCard;
