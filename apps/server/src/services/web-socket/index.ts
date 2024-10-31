import WS from "ws";
import http from "http";
import { NavalGame } from "~/modules/naval-game";

const MAX_CLIENTS = 2;

type Client = {
  id: number;
  socket: WS;
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

  public initialize() {
    this.wss.on("connection", (ws) => {
      console.info("A new client has connected.");
      if (this.clients.length >= MAX_CLIENTS) {
        ws.close(1000, "Connection limit reached.");
        return;
      }
      const clientId = this.clients.length;
      this.clients.push({ id: clientId, socket: ws });
      if (this.clients[0] && this.clients[1]) {
        this.navalGame = new NavalGame({
          player1Id: this.clients[0].id,
          player2Id: this.clients[1].id,
        });
      }

      ws.on("message", (message) => {
        if (!this.navalGame) {
          return;
        }

        console.log(`Received from Client ${clientId}: ${message}`);
        this.wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WS.OPEN) {
            client.send(message);
          }
        });
      });

      ws.on("close", () => {
        console.info("A client has disconnected.");
        this.clients = this.clients.filter((client) => client.id !== clientId);
      });
    });

    const PORT = process.env.PORT || 3000;
    this.server.listen(PORT, () => {
      console.info(`WebSocket server is listening on port ${PORT}`);
    });
  }
}

const webSocket = new WebSocket();
export default webSocket;
