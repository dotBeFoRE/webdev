import { Fragment } from 'react';
import Field from './Field';

const Board = () => {
  const board = new Array(8).fill(null).map((_, row) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={row}>
      {new Array(8).fill(null).map((__, column) => (
        // eslint-disable-next-line react/no-array-index-key
        <Field key={column} y={row} x={column} />
      ))}
    </Fragment>
  ));

  return (
    <div className="container m-auto grid aspect-square max-w-2xl grid-cols-8 gap-1">
      {board}
    </div>
  );
};

export default Board;
