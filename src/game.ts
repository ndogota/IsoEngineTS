import { Tile } from "./tile";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private tilesSet: Array<Tile>;
    private canvasWidth;
    private canvasHeight;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, tilesSet: Array<Tile>, canvasWidth: number, canvasHeight: number) {
        this.canvas = canvas
        this.ctx = ctx;
        this.tilesSet = tilesSet;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    public start() {
        this.gameLoop();
    }

    private gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        this.tilesSet[0].render(this.ctx);
    }
}