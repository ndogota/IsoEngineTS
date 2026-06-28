import { TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, FPS, MAP_ROWS, MAP_COLS } from './constants';
import { Fps } from './fps';
import { Map, GridPoint } from "./map";
import { Player } from "./player";
import { Keyboard } from "./input";
import { Renderable, Updatable } from "./interfaces";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: Map;
    private player: Player;
    private keyboard: Keyboard;
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
        this.map = new Map(MAP_ROWS, MAP_COLS, (CANVAS_WIDTH >> 1) - TILE_HEIGHT, TILE_HEIGHT * 3);
        this.keyboard = new Keyboard();
        this.player = new Player(this.map, this.keyboard, MAP_ROWS >> 1, MAP_COLS >> 1);
        this.fpsDisplay = new Fps();

        // register components for update and render (render order = draw order)
        this.updatables.push(this.player, this.fpsDisplay);
        this.renderables.push(this.map, this.player, this.fpsDisplay);

        this.canvas.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
    }

    public start(): void {
        this.map.putTiles();
        requestAnimationFrame(() => this.gameLoop())
    }

    private onMouseMove(e: MouseEvent): void {
        // the canvas is scaled by CSS, so map client coords back to canvas pixels
        const rect: DOMRect = this.canvas.getBoundingClientRect();
        const scaleX: number = this.canvas.width / rect.width;
        const scaleY: number = this.canvas.height / rect.height;

        const canvasX: number = (e.clientX - rect.left) * scaleX;
        const canvasY: number = (e.clientY - rect.top) * scaleY;

        const grid: GridPoint = this.map.screenToGrid(canvasX, canvasY);
        this.map.setHover(grid.row, grid.col);
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
