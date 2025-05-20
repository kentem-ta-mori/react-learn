import React, { FC, useState } from 'react';
interface SquareValue {
  value: null | 'X' | 'O';
}
const Square: FC<{ square: SquareValue, onSquareClick: () => void }> = ({ square, onSquareClick }) => {

  return (
    <button className="square" onClick={onSquareClick}>{square.value}</button>
  );
}

const Board: FC<{ xIsNext: boolean, squares: SquareValue[], onPlay: (nextSquares: SquareValue[]) => void }> = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (i: number) => {
    if (squares[i].value || calculateWinner(squares)) return;

    // squares.slice()だと、シャローコピーになるので、想定した動作にならない
    const nextSquares = squares.map(sq => ({ ...sq }));
    nextSquares[i].value = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }

  const calculateWinner = (squares: SquareValue[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] &&
        squares[a].value === squares[b].value &&
        squares[a].value === squares[c].value) {
        return squares[a].value;
      }
    }
    return null
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardSize = 3;
  const rows: SquareValue[][] = [];
  for (let i = 0; i < squares.length; i += boardSize) {
    rows.push(squares.slice(i, i + boardSize));
  }

  return (
    <>
      <div className='status'>{status}</div>
      {rows.map((rowItems, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {rowItems.map((squareData, colIndex) => {
            // 元の1次元配列におけるインデックスを計算
            const squareIndex = rowIndex * boardSize + colIndex;
            return (
              <Square
                key={squareIndex}
                square={squareData}
                onSquareClick={() => handleClick(squareIndex)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

const Game: FC<{}> = () => {
  const [history, setHistory] = useState<SquareValue[][]>(
    [
      Array.from({ length: 9 }, () => ({ value: null }))
    ]
  );
  const [currentMove, setCurrentMove] = useState<number>(0)
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares: SquareValue[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move !== currentMove ? 
        (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <span>{`You are at move #${currentMove}`}</span>
        )}
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
