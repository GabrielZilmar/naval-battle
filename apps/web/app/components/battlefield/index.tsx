"use client";

import { useEffect, useState } from "react";
import Board from "../board";

const Battlefield = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [myBoard, setMyBoard] = useState<boolean[][]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3030");
    ws.onmessage = (event) => {
      if (event.data.includes("won")) {
        alert(event.data);
        return;
      }
      setMyBoard(JSON.parse(event.data));
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
    <div style={{ height: "100vh", alignContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          padding: "1em",
        }}
      >
        <Board shipCoordinates={myBoard} cellSize={25} />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyItems: "center",
          justifyContent: "center",
        }}
      >
        <Board onCellClick={handleCellClick} />
      </div>
    </div>
  );
};

export default Battlefield;
