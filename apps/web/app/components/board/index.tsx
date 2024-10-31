"use client";

import { useEffect, useState } from "react";

const SQUARE_SIZE = 50;
const BOARD_SIZE = 5;

type BoardProps = {
  cellSize?: number;
  boardSize?: number;
};

const Board: React.FC<BoardProps> = ({
  cellSize = SQUARE_SIZE,
  boardSize = BOARD_SIZE,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [board, setBoard] = useState<boolean[][]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3030");
    ws.onmessage = (event) => {
      if (event.data.includes("won")) {
        alert(event.data);
        return;
      }
      setBoard(JSON.parse(event.data));
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(`${row},${col}`);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${cellSize}px)`,
        gap: "5px",
      }}
    >
      {Array.from({ length: boardSize }).map((_, row) =>
        Array.from({ length: boardSize }).map((_, col) => (
          <button
            key={`${row}-${col}`}
            onClick={() => handleCellClick(row, col)}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: board[row]?.[col] ? "#f33" : "#a2d2ff",
              border: "1px solid #555",
            }}
          >
            {`${row},${col}`}
          </button>
        ))
      )}
    </div>
  );
};

export default Board;
