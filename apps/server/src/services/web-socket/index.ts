import WS, { RawData } from "ws";
import http from "http";
import { NavalGame } from "~/modules/naval-game";

const MAX_CLIENTS = 2;

type Client = {
  id: number;
  socket: WS;
};
type OnMessageParams = {
  message: RawData | Buffer;
  clientId: number;
};

class WebSocket {
  public readonly server: http.Server;
  public readonly wss: WS.Server;
  private clients: Client[];
  private navalGame: NavalGame | null;

  constructor() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("WebSocket server is running.");
    });
    this.server = server;
    this.clients = [];
    this.navalGame = null;
    this.wss = new WS.Server({ server });
  }

  private canConnect(ws: WS) {
    if (this.clients.length >= MAX_CLIENTS) {
      ws.close(1000, "Connection limit reached.");
      return;
    }
  }

  private getCoordinatesInput(message: RawData | Buffer) {
    const [x, y] = message.toString().split(",");
    if (!x || !y) {
      throw new Error("Invalid input. Missing args");
    }
    const numX = parseInt(x);
    const numY = parseInt(y);
    if (isNaN(numX) || isNaN(numY)) {
      throw new Error("Invalid input.");
    }
    return { x: numX, y: numY };
  }

  private onConnection(ws: WS) {
    this.canConnect(ws);
    console.info("A new client has connected.");
    const clientId = this.clients.length + 1;
    this.clients.push({ id: clientId, socket: ws });
    if (this.clients[0] && this.clients[1]) {
      this.navalGame = new NavalGame({
        player1Id: this.clients[0].id,
        player2Id: this.clients[1].id,
      });
      this.navalGame.init();
      this.clients.forEach((client) => {
        const player = this.navalGame?.getPlayerById(client.id);
        if (player) {
          client.socket.send(JSON.stringify(player.getBoard()));
        }
      });
    }
    return clientId;
  }

  private onMessage({ message, clientId }: OnMessageParams) {
    if (!this.navalGame) {
      return;
    }
    const player = this.navalGame.getPlayerById(clientId);
    if (!player) {
      return;
    }

    try {
      const { x, y } = this.getCoordinatesInput(message);
      const attackedSuccessfully = this.navalGame.attack({
        attackerId: clientId,
        x,
        y,
      });
      if (attackedSuccessfully) {
        const clientOpponent = this.clients.find(
          (client) => client.id !== clientId
        );
        if (clientOpponent) {
          const opponent = this.navalGame.getOpponent(clientId);
          clientOpponent.socket.send(JSON.stringify(opponent.getBoard()));
        }
      }
      if (this.navalGame?.playerWinner) {
        this.clients.forEach((client) => {
          client.socket.send(`${this.navalGame?.playerWinner?.id} won!`);
          client.socket.close();
        });
      }
    } catch (err) {
      const client = this.clients.find((client) => client.id === clientId);
      client?.socket.send("Invalid input.");
    }
  }

  public initialize() {
    this.wss.on("connection", (ws) => {
      const clientId = this.onConnection(ws);

      ws.on("message", (message) => {
        this.onMessage({ message, clientId });
      });

      ws.on("close", () => {
        console.info("A client has disconnected.");
        this.clients = this.clients.filter((client) => client.id !== clientId);
      });
    });

    const PORT = process.env.PORT || 3030;
    this.server.listen(PORT, () => {
      console.info(`WebSocket server is listening on port ${PORT}`);
    });
  }
}

const webSocket = new WebSocket();
export default webSocket;
