export interface MESSAGE_TYPE {
    type: string,
    payload: any,
}

export interface MOVES {
    from: string,
    to: string,
}

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const WIN = 'win';
export const LOST = 'lost';
export const DRAW = 'draw';
export const RESIGN = 'resign';