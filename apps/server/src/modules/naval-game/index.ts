import { Player } from "~/modules/player";

type ConstructorParams = {
  player1Id: number;
  player2Id: number;
};

export class NavalGame {
  public readonly player1: Player;
  public readonly player2: Player;
  private winner: Player | null;

  constructor({ player1Id, player2Id }: ConstructorParams) {
    this.player1 = new Player({ id: player1Id });
    this.player2 = new Player({ id: player2Id });
    this.winner = null;
  }

  get playerWinner(): Player | null {
    return this.winner;
  }
}
