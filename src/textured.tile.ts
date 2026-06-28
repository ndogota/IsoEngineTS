import { Tile } from "./tile";

export class TexturedTile extends Tile {
    public texture: HTMLImageElement | null = null;

    protected draw(ctx: CanvasRenderingContext2D): void {
        if (this.texture === null)
            return;

        const texWidth: number = this.texture.naturalWidth || this.texture.width;
        const texHeight: number = this.texture.naturalHeight || this.texture.height;

        // anchor the sprite so its base sits on the centre of the tile diamond
        const drawX: number = (this.width >> 1) - (texWidth >> 1);
        const drawY: number = (this.height >> 1) - texHeight;

        ctx.drawImage(this.texture, drawX, drawY);
    }
}
