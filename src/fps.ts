export class Fps {
    private lastFPSCheck = 0;
    private framesThisSecond = 0;
    private fps = 0;

    public update(): void {
        const msNow = window.performance.now();
        this.framesThisSecond++;
        
        if (msNow - this.lastFPSCheck >= 1000) {
            this.fps = this.framesThisSecond;
            this.framesThisSecond = 0;
            this.lastFPSCheck = msNow;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.font = "32px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(`FPS: ${this.fps}`, 10, 42);
    }
}