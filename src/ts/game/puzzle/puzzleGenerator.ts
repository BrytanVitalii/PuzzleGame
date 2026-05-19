import { getGrid } from "../../util/grid";
import type { Difficulty } from "../difficulty";
import { PuzzlePiece } from "./puzzlePiece";

export async function getPuzzles(image: HTMLImageElement, difficulty: Difficulty, canvasDimensions: CanvasDimensions): Promise<PuzzlePiece[]> {
  const difficultyPieceCount = {
    easy: 9,
    medium: 16,
    hard: 32,
    expert: 64,
  } as const;

  const targetPieceCount = difficultyPieceCount[difficulty];
  const { width, height } = await getImageDimensions(image);

  console.log(`getPuzzles called: {img: ${image}, diff: ${difficulty}, canvasDimensions: ${canvasDimensions}}`);
  return generatePuzzles(image, targetPieceCount, width, height, canvasDimensions);
}
function generatePuzzles(
  image: HTMLImageElement,
  pieceCount: number,
  imageWidth: number,
  imageHeight: number,
  canvasDimensions: CanvasDimensions
): PuzzlePiece[] {
  const { rows, cols } = getGrid(pieceCount, imageWidth / imageHeight);
  console.log(`Generated Grid: {${rows}, ${cols}}`)
  console.log(`Image properties: Width: ${imageWidth}, Height: ${imageHeight}`);

  const sourcePieceWidth = imageWidth / cols;
  const sourcePieceHeight = imageHeight / rows;
  console.log(`Piece Properties: Width: ${sourcePieceWidth}, Height: ${sourcePieceHeight}, Count: ${pieceCount}`)

  const screenPieceSize = Math.min(canvasDimensions.height / rows, canvasDimensions.width / cols) / 1.5;

  console.log("Generating pieces: ")

  const pieces: PuzzlePiece[] = [];
  let id = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const angle = Math.random() * Math.PI * 2;

      const minRadius = 200; // protected center radius
      const maxRadius = Math.min(canvasDimensions.height / 3, canvasDimensions.width / 3);

      const radius =
        minRadius + Math.random() * (maxRadius - minRadius);

      const spawnX =
        window.innerWidth / 2 +
        Math.cos(angle) * radius -
        screenPieceSize / 2;

      const spawnY =
        window.innerHeight / 2 +
        Math.sin(angle) * radius -
        screenPieceSize / 2;

      const correctNeighbors = {
        top: row > 0 ? (id - cols) : (undefined),
        right: col < cols - 1 ? (id + 1) : (undefined),
        bottom: row < rows - 1 ? (id + cols) : (undefined),
        left: col > 0 ? (id - 1) : (undefined),
      };

      const piece: PuzzlePiece = new PuzzlePiece(
        id,
        -1,
        spawnX,
        spawnY,
        screenPieceSize,
        screenPieceSize,
        0,
        image,
        col * sourcePieceWidth,
        row * sourcePieceHeight,
        sourcePieceWidth,
        sourcePieceHeight,
        correctNeighbors
      );
      console.log(piece);

      pieces.push(piece);
      id++;
    }
  }

  return pieces;
}

async function getImageDimensions(
  img: HTMLImageElement
): Promise<{ width: number; height: number }> {
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}