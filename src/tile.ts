export class Tile {
    public width: number = 0;
    public height: number = 0;

    public row: number = 0;
    public col: number = 0;

    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    
    constructor(width: number, height: number, x: number = 0, y: number = 0, z: number = 0) {
        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;
        this.z = z;
    }

    protected draw(ctx: CanvasRenderingContext2D) {
        const midX: number = Math.round(this.width / 2);
        const midY: number = Math.round(this.height / 2);

        ctx.strokeStyle = "#3b3b3b";
        ctx.fillStyle = "green";
        ctx.beginPath();

        ctx.moveTo(midX, 0);
        ctx.lineTo(0, midY);
        ctx.lineTo(midX, this.height);
        ctx.lineTo(this.width, midY);
        ctx.lineTo(midX, 0);

        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.save();
        ctx.translate(this.x, this.y - this.z);
        this.draw(ctx);
        ctx.restore();
    }
}