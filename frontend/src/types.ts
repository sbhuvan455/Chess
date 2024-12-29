export interface MESSAGE_TYPE {
    type: string,
    payload: any,
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