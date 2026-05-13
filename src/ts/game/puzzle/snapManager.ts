import type { PuzzlePiece } from "./puzzlePiece";

// Snap pieces is all requirements are met
export function SnapIfPossible(
    targetPiece: PuzzlePiece,
    getPieces: () => PuzzlePiece[] | undefined,
    getGroupByPiece: (piece: PuzzlePiece) => PieceGroup | undefined
): boolean {
    const pieces = getPieces();
    if (!pieces) return false;

    const neighbors = targetPiece.correctNeighbors;
    if (!neighbors) return false;

    for (const direction of ["top", "right", "bottom", "left"] as const) {
        const neighborId = neighbors[direction];
        if (!neighborId) continue;

        const neighbor = pieces.find(p => p.id === neighborId);
        if (!neighbor) continue;
        if (targetPiece.groupId !== -1 || neighbor.groupId !== -1) {
            if (targetPiece.groupId === neighbor.groupId) {
                continue;
            }
        }

        // If close enough then snap PieceB to PieceA, and fire event
        const closeEnough = canSnap(direction, targetPiece, neighbor);
        if (!closeEnough) continue;

        snap(direction, neighbor, targetPiece, getGroupByPiece);
        window.dispatchEvent(new CustomEvent("game:piece-snap", {
            detail: {
                pieceA: neighbor,
                pieceB: targetPiece
            }
        }));

        return true;
    }

    return false;
}

// Snap pieceB position to pieceA position
function snap(
    direction: string,
    pieceA: PuzzlePiece,
    pieceB: PuzzlePiece,
    getGroupByPiece: (p: PuzzlePiece) => PieceGroup | undefined
) {
    const groupA = getGroupByPiece(pieceA);
    const groupB = getGroupByPiece(pieceB);

    const movingPieces = groupB?.pieces ?? [pieceB];

    let targetX = 0;
    let targetY = 0;

    switch (direction) {
        case "left":
            targetX = pieceA.x + pieceA.width;
            targetY = pieceA.y;
            break;

        case "right":
            targetX = pieceA.x - pieceB.width;
            targetY = pieceA.y;
            break;

        case "top":
            targetX = pieceA.x;
            targetY = pieceA.y + pieceA.height;
            break;

        case "bottom":
            targetX = pieceA.x;
            targetY = pieceA.y - pieceB.height;
            break;
    }

    const dx = targetX - pieceB.x;
    const dy = targetY - pieceB.y;

    for (const p of movingPieces) {
        p.moveTo(p.x + dx, p.y + dy);
    }
}
// Check if the pieces are close enough to snap
function canSnap(direction: string, targetPiece: PuzzlePiece, neighbor: PuzzlePiece) {
    const SNAP_THRESHOLD = 20;

    let closeEnough = false;

    switch (direction) {
        case "left":
            closeEnough =
                Math.abs(targetPiece.x - (neighbor.x + neighbor.width)) < SNAP_THRESHOLD &&
                Math.abs(targetPiece.y - neighbor.y) < SNAP_THRESHOLD;
            break;

        case "right":
            closeEnough =
                Math.abs((targetPiece.x + targetPiece.width) - neighbor.x) < SNAP_THRESHOLD &&
                Math.abs(targetPiece.y - neighbor.y) < SNAP_THRESHOLD;
            break;

        case "top":
            closeEnough =
                Math.abs(targetPiece.y - (neighbor.y + neighbor.height)) < SNAP_THRESHOLD &&
                Math.abs(targetPiece.x - neighbor.x) < SNAP_THRESHOLD;
            break;

        case "bottom":
            closeEnough =
                Math.abs((targetPiece.y + targetPiece.height) - neighbor.y) < SNAP_THRESHOLD &&
                Math.abs(targetPiece.x - neighbor.x) < SNAP_THRESHOLD;
            break;
    }

    return closeEnough;
}
