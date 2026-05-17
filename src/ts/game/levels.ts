const BASE_URL = import.meta.env.BASE_URL;

export const puzzleLevels = [
    { id: 0, imagePath: `${BASE_URL}assets/puzzles/artemis.webp` },
    { id: 1, imagePath: `${BASE_URL}assets/puzzles/mountain-view.webp` },
    { id: 2, imagePath: `${BASE_URL}assets/puzzles/steve.webp` },
] as const;

export type Level = typeof puzzleLevels[number];