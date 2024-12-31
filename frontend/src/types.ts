import { Square } from "chess.js";

export interface Payload_Type {
    message: string;
    from?: string;
    to?: string;
    after?: string;
    color?: string;
}

export interface Promote {
    from: string | null;
    to: string | null;
}

export interface MESSAGE_TYPE {
    type: string,
    payload: Payload_Type | string,
    moveNumber?: number
}

export interface MOVES {
    from: string,
    to: string,
}

export interface ChessMove {
    moveNumber: number
    from: string
    to: string
}

export interface Result {
    result: string
    message: string
}

export const INIT_GAME = 'init_game';
export const DISCONNECT = 'disconnect';
export const MOVE = 'move';
export const WIN = 'win';
export const LOST = 'lost';
export const DRAW = 'draw';
export const RESIGN = 'resign';