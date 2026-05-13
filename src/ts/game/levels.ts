export const puzzleLevels = [
    { id: 0, imagePath: "/assets/puzzles/artemis.jpg" },
    { id: 1, imagePath: "/assets/puzzles/mountain-view.jpg" },
    { id: 2, imagePath: "/assets/puzzles/steve.jpg" },
] as const;

export type Level = typeof puzzleLevels[number];