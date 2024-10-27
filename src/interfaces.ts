export interface Renderable {
    render(ctx: CanvasRenderingContext2D): void;
}

export interface Updatable {
    update(deltaTime: number): void;
}