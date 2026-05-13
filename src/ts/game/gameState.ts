export const GameState = {
    generating: 'generating',
    loading: 'loading',
    playing: 'playing',
    finished: 'finished',
} as const;

export type GameState = typeof GameState[keyof typeof GameState];