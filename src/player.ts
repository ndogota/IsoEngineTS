import { TexturedTile } from "./textured.tile";
import { Map, ScreenPoint } from "./map";
import { Keyboard } from "./input";
import { Renderable, Updatable } from "./interfaces";
import { TILE_WIDTH, TILE_HEIGHT, MOVE_INTERVAL } from './constants';

export class Player implements Updatable, Renderable {
    private tile: TexturedTile;
    private map: Map;
    private keyboard: Keyboard;

    public row: number;
    public col: number;

    private cooldown: number = 0;

    constructor(map: Map, keyboard: Keyboard, row: number, col: number) {
        this.map = map;
        this.keyboard = keyboard;
        this.row = row;
        this.col = col;

        this.tile = new TexturedTile(TILE_WIDTH, TILE_HEIGHT);
        this.tile.texture = document.querySelector("#player") as HTMLImageElement;
    }

    public update(deltaTime: number): void {
        this.cooldown -= deltaTime;
        if (this.cooldown > 0)
            return;

        let dRow: number = 0;
        let dCol: number = 0;

        // arrow keys / WASD move along the two isometric grid axes
        if (this.keyboard.isDown("ArrowUp", "w")) dRow = -1;
        else if (this.keyboard.isDown("ArrowDown", "s")) dRow = 1;

        if (this.keyboard.isDown("ArrowLeft", "a")) dCol = -1;
        else if (this.keyboard.isDown("ArrowRight", "d")) dCol = 1;

        if (dRow === 0 && dCol === 0)
            return;

        const nextRow: number = this.row + dRow;
        const nextCol: number = this.col + dCol;

        if (this.map.inBounds(nextRow, nextCol)) {
            this.row = nextRow;
            this.col = nextCol;
            this.cooldown = MOVE_INTERVAL;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const point: ScreenPoint = this.map.gridToScreen(this.row, this.col);
        this.tile.x = point.x;
        this.tile.y = point.y;

        ctx.save();
        ctx.translate(this.map.x, this.map.y);
        this.tile.render(ctx);
        ctx.restore();
    }
}
