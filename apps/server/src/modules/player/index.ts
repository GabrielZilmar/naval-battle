const BOARD_SIZE = 5; // 5X5
const NUM_SHIPS = 5;

type ConstructorParams = {
  id: number;
  boardSize?: number;
  numShips?: number;
};
export type ModifyShipParams = {
  x: number;
  y: number;
};

export class Player {
  public readonly id: number;
  private readonly board: boolean[][];
  private readonly ships: boolean[];
  private readonly numShips: number;
  private readonly boardSize: number;

  constructor({
    id,
    boardSize = BOARD_SIZE,
    numShips = NUM_SHIPS,
  }: ConstructorParams) {
    this.id = id;
    this.boardSize = boardSize;
    this.numShips = numShips;
    this.board = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
      this.board[i] = new Array(boardSize).fill(false);
    }
    this.ships = [];
  }

  get allShipFilled() {
    return this.ships.length === this.numShips;
  }

  get hasNoShip() {
    return this.ships.length === 0;
  }

  private validateCoordinates({ x, y }: ModifyShipParams) {
    if (x > this.boardSize || y > this.boardSize) {
      throw new Error(`X or Y is bigger than board size (${this.boardSize}).`);
    }
  }

  public addShip({ x, y }: ModifyShipParams) {
    this.validateCoordinates({ x, y });
    if (this.ships.length === this.numShips) {
      throw new Error(`You have exceeded the ships limit (${this.numShips}).`);
    }
    if (this.board[x] !== undefined && this.board[x][y] !== undefined) {
      this.board[x][y] = true;
    }
    this.ships.push(true);
  }

  public removeShip({ x, y }: ModifyShipParams) {
    this.validateCoordinates({ x, y });
    if (this.ships.length === 0) {
      throw new Error("There is no ships to remove");
    }
    if (this.board[x] === undefined || !this.board[x][y]) {
      throw new Error("There is no ship in this coordinate");
    }
    this.board[x][y] = false;
    this.ships.pop();
  }

  public sufferAttack({ x, y }: ModifyShipParams) {
    this.validateCoordinates({ x, y });
    if (this.board[x] !== undefined && this.board[x][y]) {
      this.board[x][y] = false;
      this.ships.pop();
    }
  }
}
