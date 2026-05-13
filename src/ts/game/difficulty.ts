export const Difficulty = {
    easy: "easy",
    medium: "medium",
    hard: "hard",
    expert: "expert",
} as const;
export type Difficulty = typeof Difficulty[keyof typeof Difficulty];