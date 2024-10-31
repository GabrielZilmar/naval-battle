const SQUARE_SIZE = 50;
const BOARD_SIZE = 5;

type BoardProps = {
  cellSize?: number;
  boardSize?: number;
  onCellClick?: (row: number, col: number) => void;
  shipCoordinates?: boolean[][];
};

const Board: React.FC<BoardProps> = ({
  cellSize = SQUARE_SIZE,
  boardSize = BOARD_SIZE,
  onCellClick,
  shipCoordinates,
}) => {
  const handleCellClick = (row: number, col: number) => {
    if (onCellClick) {
      onCellClick(row, col);
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
              backgroundColor: shipCoordinates?.[row]?.[col]
                ? "#f33"
                : "#a2d2ff",
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
