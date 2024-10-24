import { Tile } from "./tile";

import { TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { Map } from "./map";
import { TexturedTile } from "./textured.tile";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map:Map;
    

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this.canvas = canvas
        this.ctx = ctx;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.map = new Map(30, 30, (CANVAS_WIDTH >> 1) - TILE_HEIGHT, 0);
    }

    public start() {
        const player: TexturedTile = new TexturedTile(TILE_WIDTH, TILE_HEIGHT);
        player.texture = document.querySelector("#player") as HTMLImageElement;
        this.map.reset();
        this.map.setTileAt(player, 4, 16);

        this.tick();
        // maybe to delete after the implementation of the gameloop
        this.gameLoop();
    }

    private movePlayer(player: Tile, frame: number): void {
        player.x -= Math.round(Math.random() * 8) - 2;
        player.y += Math.round(Math.random() * 8) - 2;
    }

    // TODO : - Make the tick and fps system more clear (with frame limit)
    public tick(frame:number = 0) {
        const player:Tile = this.map.getTileAt(4, 16) as Tile;

        this.movePlayer(player, frame);

        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.map.render(this.ctx);

        // :((((((((((
        setTimeout (
            () => {
                this.tick(frame + 1);
            },

            100
        )
    }

    // TODO : - maybe remove when we're gonna implement the real gameloop (with tickrate)
    private gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
    }
}