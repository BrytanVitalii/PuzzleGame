type Grid = {
    rows: number;
    cols: number;
};

export function getGrid(pieceCount: number, aspect: number): Grid {
    let cols = Math.round(Math.sqrt(pieceCount * aspect));
    let rows = Math.round(pieceCount / cols);

    return { rows, cols };
}