// Game.ts

import type { Difficulty } from "./difficulty";
import { GameState } from "./gameState";
import { getPuzzles } from "./puzzle/puzzleGenerator";
import type { PuzzlePiece } from "./puzzle/puzzlePiece";
import { clearCanvas, handleResize, renderPuzzle } from "./puzzle/renderPuzzle";
import { DragAndDropController } from "./puzzle/dragAndDrop";
import { createGroup } from "./puzzle/groupManager";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = setupCanvas(canvas);
let lastCanvasDimensions = getCanvasDimensions();

type Game = {
    difficulty: Difficulty;
    levelID: number | undefined;
    image: HTMLImageElement;
    gameState: GameState;
    puzzles: PuzzlePiece[] | undefined;
    groups: PieceGroup[];
}
let running = false;
let currentGame: Game | undefined;
let lastTime = 0;
let nextGroupId = 0;

let dragAndDropController: DragAndDropController = new DragAndDropController(canvas);

const getGroupByPiece = (piece: PuzzlePiece) => {
    return currentGame?.groups.find(g =>
        g.pieces.some(p => p.id === piece.id)
    );
}

// Game functions
export function startGame(event: StartGameEvent) {
    currentGame = {
        difficulty: event.detail.difficulty,
        levelID: event.detail.levelID,
        image: event.detail.image,
        gameState: GameState.loading,
        puzzles: undefined,
        groups: []
    };

    running = true;
    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

    loadGame();
}

async function loadGame() {
    if (!currentGame) return;

    currentGame.gameState = GameState.loading;

    const puzzles = await getPuzzles(currentGame.image, currentGame.difficulty, getCanvasDimensions());

    currentGame.puzzles = puzzles;

    dragAndDropController.setCallbacks(
        () => currentGame?.puzzles,
        getGroupByPiece
    )

    currentGame.gameState = GameState.playing;
}

function setupCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    return ctx;
}

function getCanvasDimensions(): CanvasDimensions {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const width = rect.width * dpr;
    const height = rect.height * dpr;

    return { width, height }
}

function gameLoop(timestamp: number) {
    if (!running || !currentGame) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    render(deltaTime);

    requestAnimationFrame(gameLoop);
}

function update(_deltaTime: number) {
    if (!currentGame) return;

    if (currentGame.gameState === GameState.finished) {
        running = false;
    }
}

function render(_deltaTime: number) {
    if (!currentGame) return;

    switch (currentGame.gameState) {

        case GameState.loading:
            //renderLoading();
            break;

        case GameState.playing:
            if (currentGame.image && currentGame.puzzles) {
                renderPuzzle(ctx, currentGame.image, currentGame.puzzles);
            }
            break;

        case GameState.finished:
            //renderFinished();
            break;
    }
}

// Checks if the puzzle is solved, if there is no puzzle defaults to false.
function checkSolved(): boolean {
    if (!currentGame || !currentGame.puzzles) {
        console.error("No puzzle found to check solve state!")
        return false;
    }

    const allPiecesHaveGroups = !currentGame.puzzles.some(piece => piece.groupId === -1);

    return allPiecesHaveGroups && currentGame.groups.length === 1;
}

// Event Handlers
function onPiecesSnapped(event: PieceSnapEvent) {
    const pieceA: PuzzlePiece = event.detail.pieceA;
    const pieceB: PuzzlePiece = event.detail.pieceB;
    if (!currentGame) return;

    const groupA = currentGame.groups.find(
        g => g.id === pieceA.groupId
    );

    const groupB = currentGame.groups.find(
        g => g.id === pieceB.groupId
    );


    // If no pieces are in a group
    if (!groupA && !groupB) {
        const groupId = nextGroupId++;
        pieceA.groupId = groupId;
        pieceB.groupId = groupId;

        currentGame.groups.push(
            createGroup(groupId, [pieceA, pieceB])
        );

        return;
    }

    if (groupA === groupB) return;

    // If both pieces are alredy in a group, merge groupB to groupA
    if (groupA && groupB) {
        groupB.pieces.forEach(p => p.groupId = groupA.id)
        groupA.pieces.push(...groupB.pieces);
        currentGame.groups = currentGame.groups.filter(
            group => group !== groupB
        );

        return;
    }

    // If only one piece is in a group
    if (groupA && !groupB) {
        pieceB.groupId = groupA.id;
        groupA.pieces.push(pieceB);
        return;
    }
    if (groupB && !groupA) {
        pieceA.groupId = groupB.id;
        groupB.pieces.push(pieceA);
        return;
    }
}

function onVictory(_event: VictoryEvent) {
    if (!currentGame || !currentGame.puzzles) {
        console.error("No puzzle found to set Victory GameState")
        return false;
    }

    currentGame.gameState = GameState.finished;
    clearCanvas(ctx);
}

function onStopGame(_event: StopGameEvent) {
    dragAndDropController.setCallbacks(
        () => undefined,
        () => undefined
    );

    running = false;
    currentGame = undefined;
    lastTime = 0;
}

// Event Listeners
window.addEventListener('game:start-game', (event) => {
    startGame(event as StartGameEvent);
});

window.addEventListener('game:victory', (event) => {
    onVictory(event as VictoryEvent);
});

window.addEventListener('game:stop-game', (event) => {
    onStopGame(event as StopGameEvent);
})

window.addEventListener('game:piece-snap', (event) => {
    onPiecesSnapped(event as PieceSnapEvent); // Snap a piece

    // If that piece solved the puzzle then fire game:victory event.
    if (currentGame && checkSolved()) {
        window.dispatchEvent(new CustomEvent('game:victory', {
            detail: {
                difficulty: currentGame.difficulty,
                levelID: currentGame.levelID,
                image: currentGame.image
            }
        }));
    }
});

// Fix render scaling on rezize.
window.addEventListener('resize', () => {
    const newDimensions = getCanvasDimensions();

    // Recalculate canvas backing store for new DPR/size
    setupCanvas(canvas);

    // Scale existing pieces proportionally
    if (currentGame && currentGame.puzzles) {
        handleResize(
            newDimensions,
            lastCanvasDimensions,
            () => currentGame?.puzzles,
            getGroupByPiece
        );
    }

    lastCanvasDimensions = newDimensions;
});