import { Player } from "~/modules/player";

const BOARD_SIZE = 5;

type ConstructorParams = {
  player1Id: number;
  player2Id: number;
};

type AttackParams = {
  attackerId: number;
  x: number;
  y: number;
};

export class NavalGame {
  public readonly player1: Player;
  public readonly player2: Player;
  private winner: Player | null;

  constructor({ player1Id, player2Id }: ConstructorParams) {
    this.player1 = new Player({ id: player1Id, boardSize: BOARD_SIZE });
    this.player2 = new Player({ id: player2Id, boardSize: BOARD_SIZE });
    this.winner = null;
  }

  get playerWinner(): Player | null {
    return this.winner;
  }

  public getPlayerById(id: number) {
    return this.player1.id === id ? this.player1 : this.player2;
  }

  public getOpponent(playerId: number) {
    return this.player1.id === playerId ? this.player2 : this.player1;
  }

  public attack({ attackerId, x, y }: AttackParams) {
    const opponent = this.getOpponent(attackerId);
    const attackSuccessfully = opponent.sufferAttack({ x, y });
    if (opponent.hasNoShip) {
      this.winner = this.getPlayerById(attackerId);
    }
    return attackSuccessfully;
  }

  public init() {
    do {
      const randomX = Math.floor(Math.random() * BOARD_SIZE);
      const randomY = Math.floor(Math.random() * BOARD_SIZE);
      this.player1.addShip({ x: randomX, y: randomY });
    } while (!this.player1.allShipFilled);

    do {
      const randomX = Math.floor(Math.random() * BOARD_SIZE);
      const randomY = Math.floor(Math.random() * BOARD_SIZE);
      this.player2.addShip({ x: randomX, y: randomY });
    } while (!this.player2.allShipFilled);
  }
}
