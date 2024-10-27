import { TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, FPS } from './constants';
import { Fps } from './fps';
import { Map } from "./map";
import { Renderable, Updatable } from "./interfaces";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: Map;
    private fpsDisplay: Fps;

    private msPrev = window.performance.now();
    private msPerFrame = 1000 / FPS;
    private deltaTime = 0;

    private updatables: Updatable[] = [];
    private renderables: Renderable[] = [];

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this.canvas = canvas
        this.ctx = ctx;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        // init components
        this.map = new Map(30, 30, (CANVAS_WIDTH >> 1) - TILE_HEIGHT, 0);
        this.fpsDisplay = new Fps();

        // register components for update and render
        this.updatables.push(this.fpsDisplay);
        this.renderables.push(this.map, this.fpsDisplay);
    }

    public start():void {
        this.map.putTiles();
        requestAnimationFrame(() => this.gameLoop())
    }

    private update(deltaTime: number): void {
        this.updatables.forEach(u => u.update(deltaTime));
    }

    private render(): void {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.renderables.forEach(r => r.render(this.ctx));
    }

    private gameLoop(): void {
        requestAnimationFrame(() => this.gameLoop());

        const msNow = window.performance.now();
        const msPassed = msNow - this.msPrev;

        if (msPassed >= this.msPerFrame) {
            this.deltaTime = msPassed / 1000;
            this.update(this.deltaTime);
            this.render();
            this.msPrev = msNow;
        }

        const excessTime = msPassed % this.msPerFrame;
        this.msPrev = msNow - excessTime;
    }
}