export class PuzzlePiece {
    id: number;
    groupId: number;

    x: number;
    y: number;

    width: number;
    height: number;

    rotation: number;

    sourceImage: HTMLImageElement;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;

    correctNeighbors: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };

    constructor(
        id: number,
        groupId: number,

        x: number,
        y: number,

        width: number,
        height: number,

        rotation: number,

        sourceImage: HTMLImageElement,
        sourceX: number,
        sourceY: number,
        sourceWidth: number,
        sourceHeight: number,

        correctNeighbors: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        }
    ) {
        this.id = id;
        this.groupId = groupId;

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.rotation = rotation;

        this.sourceImage = sourceImage;
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;

        this.correctNeighbors = correctNeighbors;
    }

    isPointInside(mouseX: number, mouseY: number): boolean {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    moveTo(newX: number, newY: number): void {
        this.x = newX;
        this.y = newY;
    }
}