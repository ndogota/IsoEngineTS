import { Tile } from "./tile";
import { TILE_WIDTH, TILE_HEIGHT } from './constants';

export interface GridPoint {
    row: number;
    col: number;
}

export interface ScreenPoint {
    x: number;
    y: number;
}

export class Map {
    private tiles: Tile[] = [];
    public rows: number = 0;
    public cols: number = 0;
    public x: number = 0;
    public y: number = 0;

    private hovered: Tile | null = null;

    constructor(rows: number, cols: number, x: number, y: number) {
        this.rows = rows;
        this.cols = cols;

        this.x = x;
        this.y = y;
    }

    protected calcPos(tile: Tile, row: number, col: number) {
        const point: ScreenPoint = this.gridToScreen(row, col);
        tile.x = point.x;
        tile.y = point.y;
    }

    // grid (row, col) -> top-left of the tile diamond, in map-local space
    public gridToScreen(row: number, col: number): ScreenPoint {
        const midWidth: number = TILE_WIDTH >> 1;
        const midHeight: number = TILE_HEIGHT >> 1;

        return {
            x: (col - row) * midWidth,
            y: (col + row) * midHeight,
        };
    }

    // canvas (x, y) -> nearest grid (row, col); inverse isometric projection
    public screenToGrid(screenX: number, screenY: number): GridPoint {
        const midWidth: number = TILE_WIDTH >> 1;
        const midHeight: number = TILE_HEIGHT >> 1;

        // move into map-local space and onto the tile-centre origin
        const localX: number = screenX - this.x - midWidth;
        const localY: number = screenY - this.y - midHeight;

        const a: number = localX / midWidth;  // col - row
        const b: number = localY / midHeight; // col + row

        return {
            row: Math.round((b - a) / 2),
            col: Math.round((a + b) / 2),
        };
    }

    public inBounds(row: number, col: number): boolean {
        return row >= 0 && col >= 0 && row < this.rows && col < this.cols;
    }

    public getTile(row: number, col: number): Tile | null {
        if (!this.inBounds(row, col))
            return null;
        return this.tiles[row * this.cols + col];
    }

    public setHover(row: number, col: number): void {
        const next: Tile | null = this.getTile(row, col);
        if (next === this.hovered)
            return;
        if (this.hovered !== null)
            this.hovered.highlighted = false;
        if (next !== null)
            next.highlighted = true;
        this.hovered = next;
    }

    public putTiles(): void {
        this.tiles = [];

        for (let i: number = 0; i < this.rows; i++) {
            for (let j: number = 0; j < this.cols; j++) {
                const tile: Tile = new Tile(TILE_WIDTH, TILE_HEIGHT);
                tile.fill = (i + j) % 2 === 0 ? "#7c8a99" : "#5d6b7a";
                this.calcPos(tile, i, j);
                this.tiles.push(tile);
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
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
