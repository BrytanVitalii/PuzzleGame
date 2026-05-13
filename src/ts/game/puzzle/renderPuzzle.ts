import { PuzzlePiece } from "./puzzlePiece";

export function renderPuzzle(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    pieces: PuzzlePiece[]
) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw each piece
    for (const piece of pieces) {
        ctx.save();

        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);

        ctx.drawImage(
            image,
            piece.sourceX,
            piece.sourceY,
            piece.sourceWidth,
            piece.sourceHeight,
            0,
            0,
            piece.width,
            piece.height
        );

        ctx.restore();
    }
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}