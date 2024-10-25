import { TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, FPS } from './constants';
import { Map } from "./map";
import { TexturedTile } from "./textured.tile";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map:Map;

    private msPrev = window.performance.now();
    private msPerFrame = 1000 / FPS;
    
    private frame: number = 0;

    private lastFPSCheck = 0;
    private framesThisSecond = 0;
    private fps = 0;
    private deltaTime = 0;

    private x = 100;
    private y = 100;
    private speed = 50;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this.canvas = canvas
        this.ctx = ctx;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.map = new Map(30, 30, (CANVAS_WIDTH >> 1) - TILE_HEIGHT, 0);
    }

    public start():void {
        const player: TexturedTile = new TexturedTile(TILE_WIDTH, TILE_HEIGHT);
        player.texture = document.querySelector("#player") as HTMLImageElement;

        this.map.putTiles();
        this.map.setTileAt(player, 14, 14);

        requestAnimationFrame(() => this.gameLoop())
    }

    private update(deltaTime: number): void {
        // we should use here deltaTime for moving for example
    }

    private gameLoop(): void {
        requestAnimationFrame(() => this.gameLoop());

        const msNow = window.performance.now();
        const msPassed = msNow - this.msPrev;

        if (msPassed >= this.msPerFrame) {
            this.deltaTime = msPassed / 1000;

            this.update(this.deltaTime);

            this.render();
            
            // to put somewhere else (calculating fps)
            this.framesThisSecond++;
            if (msNow - this.lastFPSCheck >= 1000) {
                this.fps = this.framesThisSecond;
                this.framesThisSecond = 0;
                this.lastFPSCheck = msNow;
            }

            this.msPrev = msNow;
        }

        const excessTime = msPassed % this.msPerFrame;
        this.msPrev = msNow - excessTime;
    }

    private render():void {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.map.render(this.ctx);
        this.renderFPS();
    }

    // to put somewhere else (render fps on screen)
    private renderFPS(): void {
        this.ctx.font = "32px Arial";
        this.ctx.fillStyle = "green";
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 42);
    }
}