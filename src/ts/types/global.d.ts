import type { Difficulty } from "../game/difficulty";
import type { PuzzlePiece } from "../game/puzzle/puzzlePiece";

declare global {
    // Event types
    type StartGameEvent = CustomEvent<{
        difficulty: Difficulty;
        levelID: number | undefined;
        image: HTMLImageElement;
    }>;
    type StopGameEvent = CustomEvent<{}>
    type VictoryEvent = CustomEvent<{
        difficulty: Difficulty;
        levelID: number | undefined;
        image: HTMLImageElement | undefined;
    }>;
    type PieceSnapEvent = CustomEvent<{
        pieceA: PuzzlePiece;
        pieceB: PuzzlePiece;
    }>;
    type BackgroundMusicVolumeEvent = CustomEvent<{
        newVolume: number;
    }>;


    type Slider = {
        getIndex: () => number;
    };
    type CanvasDimensions = {
        width: number,
        height: number
    };

    type DragState = {
        selectedPiece: PuzzlePiece | null;
        offsetX: number;
        offsetY: number;
    };
    type PieceGroup = {
        id: number;
        pieces: PuzzlePiece[];
    };
    type AudioInstance = {
        stop: () => void;
        setVolume: (newVolume: number) => void;
    }
}