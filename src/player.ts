import { TexturedTile } from "./textured.tile";
import { TILE_WIDTH, TILE_HEIGHT } from './constants';

export class Player {
    private tile: TexturedTile;
    private posX: number;
    private posY: number;

    constructor(posX: number, posY: number) {
        this.tile = new TexturedTile(TILE_WIDTH, TILE_HEIGHT);
        this.tile.texture = document.querySelector("#player") as HTMLImageElement;
        this.posX = posX;
        this.posY = posY;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.tile.render(ctx);
    }

    // Optional methods for movement or position update can go here.
}