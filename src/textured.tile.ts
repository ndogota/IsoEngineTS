import { Tile } from "./tile";

export class TexturedTile extends Tile {
    public texture: HTMLImageElement|null = null;

    protected draw(ctx: CanvasRenderingContext2D): void {
        if(this.texture === null)
            return;

        const heightTexture: number = this.texture.naturalHeight;
        ctx.drawImage(this.texture, 0, -heightTexture >> 1);
    }
}