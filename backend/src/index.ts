import { WebSocketServer, WebSocket } from 'ws';
import { GameManager } from './utils/gameManager';

// @ts-ignore
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

console.log("Hello world!");

const GameInstance = new GameManager();

wss.on('connection', function connection(ws: WebSocket) {
  ws.on('error', console.error);

  GameInstance.addUser(ws);
});