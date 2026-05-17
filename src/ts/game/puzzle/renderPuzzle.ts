import { PuzzlePiece } from "./puzzlePiece";
import { moveGroupBy } from "./groupManager";

// TODO: FIX REZIZING ISSUE (PIECES CHANGING ASPECT RATIO)
// Fix by recalculating on rezize
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

// Update piece positions on resize:
export function handleResize(
    newDimensions: CanvasDimensions,
    lastCanvasDimensions: CanvasDimensions,
    getPieces: () => PuzzlePiece[] | undefined,
    getGroupByPiece: (piece: PuzzlePiece) => PieceGroup | undefined
) {
    const dX = newDimensions.width - lastCanvasDimensions.width;
    const dY = newDimensions.height - lastCanvasDimensions.height;

    const pieces = getPieces();
    if (!pieces) return;

    const centerX = newDimensions.width / 2;
    const centerY = newDimensions.height / 2;
    const procesedGroups = new Set<PieceGroup>();

    for (const piece of pieces) {
        const group = getGroupByPiece(piece);
        if (group && procesedGroups.has(group)) {
            continue; // Skip pieces in groups that have already been processed
        }

        const halfDeltaX = dX / 2;
        const halfDeltaY = dY / 2;

        const newX = piece.x + halfDeltaX;
        const newY = piece.y + halfDeltaY;
        console.log(`Resizing piece ${piece.id}: newX=${newX}, newY=${newY}, halfDeltaX=${halfDeltaX}, halfDeltaY=${halfDeltaY}`);

        if (newX < 0 || newX + piece.width > newDimensions.width ||
            newY < 0 || newY + piece.height > newDimensions.height) {
            // Teleport to center
            // Add some randomness to avoid perfect overlap
            const randomizedCenterX = centerX + (Math.random() - 0.5) * 50;
            const randomizedCenterY = centerY + (Math.random() - 0.5) * 50;

            if (group) {
                moveGroupBy(group, randomizedCenterX - piece.x - piece.width / 2, randomizedCenterY - piece.y - piece.height / 2);
                procesedGroups.add(group);
            } else {
                piece.moveTo(randomizedCenterX - piece.width / 2, randomizedCenterY - piece.height / 2);
            }
        } else {
            if (group) {
                moveGroupBy(group, halfDeltaX, halfDeltaY);
                procesedGroups.add(group);
            } else {
                piece.moveTo(newX, newY);
            }
        }
    }
}
