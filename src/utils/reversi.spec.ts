import type { Board } from './reversi';
import {
  hasEnded,
  doMove,
  isValidMove,
  canMove,
  COLOR,
  getInitialBoard,
  isOnBoard,
} from './reversi';

export {};

describe('Reversi Logic', () => {
  describe('Is on board', () => {
    it('should return true for 0', () => {
      expect(isOnBoard(0)).toBe(true);
    });

    it('should return true for 7', () => {
      expect(isOnBoard(7)).toBe(true);
    });

    it('should return false for -1', () => {
      expect(isOnBoard(-1)).toBe(false);
    });

    it('should return false for 8', () => {
      expect(isOnBoard(8)).toBe(false);
    });
  });

  describe('Board initialization', () => {
    it('should return a 8x8 board', () => {
      const board = getInitialBoard();

      expect(board.length).toBe(8);
      expect(board[0].length).toBe(8);
    });

    it('should return a board with 2 black and 2 white pieces', () => {
      const board = getInitialBoard();

      const expectedBoard: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(board).toEqual(expectedBoard);
    });
  });

  describe('Is valid move', () => {
    it('Should return false if not on board', () => {
      const board: Board = getInitialBoard();

      expect(isValidMove(board, -1, 0, COLOR.BLACK)).toBe(false);
      expect(isValidMove(board, 0, -1, COLOR.BLACK)).toBe(false);
      expect(isValidMove(board, 8, 0, COLOR.BLACK)).toBe(false);
      expect(isValidMove(board, 0, 8, COLOR.BLACK)).toBe(false);
    });

    it('Should return false if not empty', () => {
      const board: Board = getInitialBoard();

      expect(isValidMove(board, 3, 3, COLOR.BLACK)).toBe(false);
      expect(isValidMove(board, 4, 4, COLOR.WHITE)).toBe(false);
    });

    it('Should return false if no valid direction', () => {
      const board: Board = getInitialBoard();

      expect(isValidMove(board, 3, 4, COLOR.BLACK)).toBe(false);
      expect(isValidMove(board, 4, 3, COLOR.BLACK)).toBe(false);
    });

    it('Should return true if valid direction', () => {
      const board: Board = getInitialBoard();

      expect(isValidMove(board, 2, 3, COLOR.BLACK)).toBe(true);
      expect(isValidMove(board, 3, 2, COLOR.BLACK)).toBe(true);
      expect(isValidMove(board, 5, 4, COLOR.BLACK)).toBe(true);
      expect(isValidMove(board, 4, 5, COLOR.BLACK)).toBe(true);
    });

    it('Should return true if valid direction', () => {
      const board: Board = getInitialBoard();

      expect(isValidMove(board, 2, 4, COLOR.WHITE)).toBe(true);
      expect(isValidMove(board, 4, 2, COLOR.WHITE)).toBe(true);
      expect(isValidMove(board, 5, 3, COLOR.WHITE)).toBe(true);
      expect(isValidMove(board, 3, 5, COLOR.WHITE)).toBe(true);
    });
  });

  describe('Can color do move', () => {
    it('Should return true for both', () => {
      const board: Board = getInitialBoard();

      expect(canMove(board, COLOR.BLACK)).toBe(true);
      expect(canMove(board, COLOR.WHITE)).toBe(true);
    });

    it('Should return true for both', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(true);
      expect(canMove(board, COLOR.WHITE)).toBe(true);
    });

    it('Should return true for both', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(true);
      expect(canMove(board, COLOR.WHITE)).toBe(true);
    });

    it('Should return true for both', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 2, 1, 1, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(true);
      expect(canMove(board, COLOR.WHITE)).toBe(true);
    });

    it('Should return true for both', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(true);
      expect(canMove(board, COLOR.WHITE)).toBe(true);
    });

    it('Should return false for both', () => {
      const board: Board = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(false);
      expect(canMove(board, COLOR.WHITE)).toBe(false);
    });

    it('Should return false for both', () => {
      const board: Board = [
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 2],
        [0, 0, 1, 1, 1, 1, 0, 2],
        [0, 0, 1, 1, 1, 0, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(false);
      expect(canMove(board, COLOR.WHITE)).toBe(false);
    });

    it('Should return false for both', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(false);
      expect(canMove(board, COLOR.WHITE)).toBe(false);
    });

    it('Should return true for black and false for white', () => {
      const board: Board = [
        [1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 1, 1],
      ];

      expect(canMove(board, COLOR.BLACK)).toBe(true);
      expect(canMove(board, COLOR.WHITE)).toBe(false);
    });
  });

  describe('Has game ended', () => {
    it('Should return true', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(hasEnded(board)).toBe(true);
    });

    it('Should return true', () => {
      const board: Board = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
      ];

      expect(hasEnded(board)).toBe(true);
    });

    it('Should return false', () => {
      const board: Board = [
        [1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 1, 1],
      ];

      expect(hasEnded(board)).toBe(false);
    });

    it('Should return false', () => {
      const board = getInitialBoard();

      expect(hasEnded(board)).toBe(false);
    });
  });

  describe('Doing moves', () => {
    it('Should return the correct board after a move', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      const expectedBoard: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(doMove(board, 0, 7, COLOR.BLACK)).toEqual({
        board: expectedBoard,
        nextPlayer: COLOR.WHITE,
        winner: null,
      });
    });

    it('Should return the correct board after a move', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      const expectedBoard: Board = [
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(doMove(board, 7, 0, COLOR.WHITE)).toEqual({
        board: expectedBoard,
        nextPlayer: COLOR.BLACK,
        winner: null,
      });
    });

    it('Should return the correct board after a move', () => {
      const board = getInitialBoard();
      const board1 = doMove(board, 3, 2, COLOR.BLACK)?.board as Board;
      const board2 = doMove(board1, 2, 2, COLOR.WHITE)?.board as Board;
      const board3 = doMove(board2, 4, 5, COLOR.BLACK)?.board as Board;

      const expectedBoard: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 2, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(board3).toEqual(expectedBoard);
    });

    it('Should return if null if the move is invalid', () => {
      const board = getInitialBoard();

      expect(doMove(board, 1, 1, COLOR.BLACK)).toBe(null);
    });

    it('Should return if null if the move is invalid', () => {
      const board = getInitialBoard();

      expect(doMove(board, 3, 3, COLOR.BLACK)).toBe(null);
    });

    it("Should pass if next player can't move", () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      const expectedBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(doMove(board, 0, 7, COLOR.BLACK)).toEqual({
        board: expectedBoard,
        nextPlayer: COLOR.BLACK,
        winner: null,
      });
    });

    it('Should return the correct winner', () => {
      const board: Board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0],
      ];

      const expectedBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(doMove(board, 6, 1, COLOR.BLACK)).toEqual({
        board: expectedBoard,
        nextPlayer: COLOR.BLACK,
        winner: COLOR.BLACK,
      });
    });
  });
});
