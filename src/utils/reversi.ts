export const COLOR = {
  NONE: 0,
  WHITE: 1,
  BLACK: 2,
} as const;

export type Color = (typeof COLOR)[keyof typeof COLOR];
export type PlayerColor = Exclude<Color, typeof COLOR.NONE>;

export type Row = [Color, Color, Color, Color, Color, Color, Color, Color];

export type Board = [Row, Row, Row, Row, Row, Row, Row, Row];

export function getInitialBoard(): Board {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
}

type ValidRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const isOnBoard = (n: number): n is ValidRange => {
  return n >= 0 && n < 8;
};

type Direction = [number, number];

export const checkChain = (
  board: Board,
  direction: Direction,
  _x: number,
  _y: number,
  color: PlayerColor,
  depth = 1,
): boolean => {
  const [dx, dy] = direction;
  const x = _x + dx;
  const y = _y + dy;

  if (!isOnBoard(x) || !isOnBoard(y)) {
    return false;
  }

  if (board[y][x] === COLOR.NONE) {
    return false;
  }

  if (board[y][x] === color) {
    return depth !== 1;
  }

  return checkChain(board, direction, x, y, color, depth + 1);
};

export const validDirections = (
  board: Board,
  x: number,
  y: number,
  color: PlayerColor,
): Direction[] => {
  const directions: Direction[] = [];

  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      if (!(dx === 0 && dy === 0) && checkChain(board, [dx, dy], x, y, color)) {
        directions.push([dx, dy]);
      }
    }
  }

  return directions;
};

export const isValidMove = (
  board: Board,
  x: number,
  y: number,
  color: PlayerColor,
): boolean => {
  if (!isOnBoard(x) || !isOnBoard(y)) {
    return false;
  }

  if (board[y][x] !== COLOR.NONE) {
    return false;
  }

  return validDirections(board, x, y, color).length > 0;
};

export const canMove = (board: Board, color: PlayerColor): boolean => {
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      if (isValidMove(board, x, y, color)) {
        return true;
      }
    }
  }
  return false;
};

export const hasEnded = (board: Board, color: PlayerColor): boolean => {
  return (
    !canMove(board, color) &&
    !canMove(board, color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE)
  );
};

export const doMove = (
  board: Board,
  x: number,
  y: number,
  color: PlayerColor,
): Board => {
  const directions = validDirections(board, x, y, color);

  if (!isOnBoard(x) || !isOnBoard(y) || !directions.length) {
    throw new Error('Invalid move');
  }

  const newBoard = board.map((row) => [...row]) as Board;
  newBoard[y][x] = color;

  directions.forEach(([dx, dy]) => {
    let cx = x + dx;
    let cy = y + dy;

    if (!isOnBoard(cx) || !isOnBoard(cy)) {
      throw new Error('Out of bounds');
    }

    while (newBoard[cy][cx] !== color) {
      newBoard[cy][cx] = color;
      cx += dx;
      cy += dy;

      if (!isOnBoard(cx) || !isOnBoard(cy)) {
        throw new Error('Out of bounds');
      }
    }
  });

  return newBoard;
};

export const winningColor = (board: Board): Color => {
  let white = 0;
  let black = 0;

  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      if (isOnBoard(x) && isOnBoard(y) && board[y][x] === COLOR.WHITE) {
        white += 1;
      } else if (isOnBoard(x) && isOnBoard(y) && board[y][x] === COLOR.BLACK) {
        black += 1;
      }
    }
  }

  if (white > black) {
    return COLOR.WHITE;
  }
  if (black > white) {
    return COLOR.BLACK;
  }
  return COLOR.NONE;
};

const binaryToString = (binary: string) => {
  const bufferLength = Math.ceil(binary.length / 8);
  const uint8Array = new Uint8Array(bufferLength);

  for (let i = 0; i < binary.length; i += 1) {
    const bit = binary[i] === '1' ? 1 : 0;
    const byteIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    // eslint-disable-next-line no-bitwise
    uint8Array[byteIndex] |= bit << bitIndex;
  }

  return new TextDecoder().decode(uint8Array);
};

const stringToBinary = (string: string) => {
  const uint8Array = new TextEncoder().encode(string);
  let binary = '';

  for (let i = 0; i < uint8Array.length; i += 1) {
    const byte = uint8Array[i] || 0;
    for (let j = 0; j < 8; j += 1) {
      // eslint-disable-next-line no-bitwise
      const bit = (byte >> (7 - j)) & 1;
      binary += bit;
    }
  }

  return binary;
};

export const exportBoard = (board: Board) => {
  return binaryToString(
    board
      .flat()
      .map((color) => ['00', '01', '11'][color] || '00')
      .join(''),
  );
};

const isColor = (color: number): color is Color => {
  return color === COLOR.WHITE || color === COLOR.BLACK || color === COLOR.NONE;
};

const isFlatBoard = (board: number[]): board is Color[] => {
  return board.every(isColor);
};

export const importBoard = (board: string) => {
  const binary = stringToBinary(board);

  const boardString = binary.split(/(..)/g);
  const flatBoard = boardString.map((color) =>
    ['00', '01', '11'].indexOf(color),
  );

  if (!isFlatBoard(flatBoard)) {
    throw new Error('Invalid board');
  }

  if (flatBoard.length !== 8 * 8) {
    throw new Error('Invalid board length');
  }

  return [
    flatBoard.slice(0, 8) as Row,
    flatBoard.slice(8, 16) as Row,
    flatBoard.slice(16, 24) as Row,
    flatBoard.slice(24, 32) as Row,
    flatBoard.slice(32, 40) as Row,
    flatBoard.slice(40, 48) as Row,
    flatBoard.slice(48, 56) as Row,
    flatBoard.slice(56, 64) as Row,
  ] as Board;
};
