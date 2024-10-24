import { Tile } from "./tile";
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_WIDTH, TILE_HEIGHT } from './constants';

export class Map {
    private tiles:Tile[] = [];
    public rows: number = 0;
    public cols: number = 0;
    public x: number = 0;
    public y: number = 0;

    constructor(rows: number, cols: number, x: number, y: number) {
        this.rows = rows;
        this.cols = cols;

        this.x = x;
        this.y = y;
    }

    protected calcPos(tile:Tile, row: number, col: number) {
        const midWidth:number = TILE_WIDTH >> 1;
        const midHeight:number = TILE_HEIGHT >> 1;

        tile.row = row;
        tile.col = col;

        tile.x = ((col - row)) * midWidth;
        tile.y = ((col + row)) * midHeight;
    }
    
    public reset(): void {
        this.tiles = [];

        for (let i: number = 0; i < this.rows; i++) {

            for (let j: number = 0; j < this.cols; j++) {
                const tile:Tile = new Tile(
                    TILE_WIDTH,
                    TILE_HEIGHT
                );

                this.calcPos(tile, i, j);

                this.tiles.push(tile);
            }
        }
    }

    // everything of that will be changed with the new render system (just for the test)
    public getTileAt(row: number, col: number): Tile | undefined {
        return this.tiles.find((tile: Tile) => (tile.row === row && tile.col === col));
    }

    // everything of that will be changed with the new render system (just for the test)
    public setTileAt(tile: Tile, row:number, col:number) {
        const current: Tile | undefined = this.getTileAt(row, col);
        if (current != null) {
            const index: number = this.tiles.indexOf(current);
            this.tiles.splice(index, 1);
        }
        this.calcPos(tile, row, col);
        this.tiles.push(tile);
    }

    public render(ctx:CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);

        this.tiles.forEach(
            (tile: Tile) => {
                tile.render(ctx);
            }
        )
        ctx.restore();
    }
}