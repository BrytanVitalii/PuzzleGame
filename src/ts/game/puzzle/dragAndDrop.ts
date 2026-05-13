import { getMousePos } from "./mouse";
import { PuzzlePiece } from "./puzzlePiece";
import { SnapIfPossible } from "./snapManager";

export class DragAndDropController {
    private canvas: HTMLCanvasElement;
    private getPieces!: () => PuzzlePiece[] | undefined;
    private getGroupByPiece!: (piece: PuzzlePiece) => PieceGroup | undefined;

    constructor(
        canvas: HTMLCanvasElement
    ) {
        this.canvas = canvas;
        this.getPieces = () => undefined;
        this.getGroupByPiece = () => undefined;

        console.log("D&D Init");
        const dragState: DragState = {
            selectedPiece: null,
            offsetX: 0,
            offsetY: 0,
        };

        this.canvas.addEventListener("mousedown", (event) => {
            const pieces = this.getPieces();
            console.log(pieces)
            if (!pieces) return;

            const mouse = getMousePos(this.canvas, event);

            for (let i = pieces.length - 1; i >= 0; i--) {
                const piece = pieces[i];

                if (piece.isPointInside(mouse.x, mouse.y)) {
                    dragState.selectedPiece = piece;

                    dragState.offsetX = mouse.x - piece.x;
                    dragState.offsetY = mouse.y - piece.y;

                    pieces.splice(i, 1);
                    pieces.push(piece);

                    break;
                }
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            const piece = dragState.selectedPiece;
            if (!piece) return;

            const mouse = getMousePos(this.canvas, event);
            const group = this.getGroupByPiece(piece);

            const newX = mouse.x - dragState.offsetX;
            const newY = mouse.y - dragState.offsetY;

            if (group) {
                // Move entire group
                const dx = newX - piece.x;
                const dy = newY - piece.y;

                for (const p of group.pieces) {
                    p.moveTo(p.x + dx, p.y + dy);
                }
            } else {
                // Move single piece
                piece.moveTo(newX, newY);
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            if (!dragState.selectedPiece) return;

            SnapIfPossible(
                dragState.selectedPiece,
                this.getPieces,
                this.getGroupByPiece
            );
            dragState.selectedPiece = null;
        });

        this.canvas.addEventListener("mouseleave", () => {
            dragState.selectedPiece = null;
        });
    }

    setCallbacks(
        getPieces: () => PuzzlePiece[] | undefined,
        getGroupByPiece: (piece: PuzzlePiece) => PieceGroup | undefined
    ) {
        this.getPieces = getPieces;
        this.getGroupByPiece = getGroupByPiece;
    }
}