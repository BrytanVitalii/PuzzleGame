const BASE_URL = import.meta.env.BASE_URL;

export const puzzleLevels = [
    { id: 0, imagePath: `${BASE_URL}assets/puzzles/artemis.jpg` },
    { id: 1, imagePath: `${BASE_URL}assets/puzzles/mountain-view.jpg` },
    { id: 2, imagePath: `${BASE_URL}assets/puzzles/steve.jpg` },
] as const;

export type Level = typeof puzzleLevels[number];