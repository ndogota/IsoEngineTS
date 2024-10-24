export class Tile {
    private width: number = 0;
    private height: number = 0;

    private x: number = 0;
    private y: number = 0;
    private z: number = 0;
    
    constructor(width: number, height: number, x: number, y: number, z: number) {
        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;
        this.z = z;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        const midX: number = Math.round(this.width / 2);
        const midY: number = Math.round(this.height / 2);

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = "green";
        ctx.beginPath();

        ctx.moveTo(midX, 0);
        ctx.lineTo(0, midY);
        ctx.lineTo(midX, this.height);
        ctx.lineTo(this.width, midY);
        ctx.lineTo(midX, 0);

        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}