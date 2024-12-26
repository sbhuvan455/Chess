import { WebSocketServer, WebSocket } from 'ws';
import { GameManager } from './utils/gameManager';

const wss = new WebSocketServer({ port: 8080 });

console.log("Hello world!");

const GameInstance = new GameManager();

wss.on('connection', function connection(ws: WebSocket) {
  ws.on('error', console.error);

  GameInstance.addUser(ws);
});