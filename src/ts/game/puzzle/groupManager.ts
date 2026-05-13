import type { PuzzlePiece } from "./puzzlePiece";

export function createGroup(id: number, pieces: PuzzlePiece[]): PieceGroup {
    return {
        id: id,
        pieces: pieces
    }
}

export function moveGroupTo(group: PieceGroup, x: number, y: number) {
    for(const piece of group.pieces) {
        piece.moveTo(x, y);
    }
}

export function moveGroupBy(group: PieceGroup, dX: number, dY: number) {
    for(const piece of group.pieces) {
        piece.moveTo(piece.x + dX, piece.y + dY);
    }
}