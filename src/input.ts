// Tracks the current keyboard state. Registered once and queried each update.
export class Keyboard {
    private pressed: { [key: string]: boolean } = {};

    constructor() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            this.pressed[e.key.toLowerCase()] = true;
        });
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.pressed[e.key.toLowerCase()] = false;
        });
    }

    public isDown(...keys: string[]): boolean {
        return keys.some((k) => this.pressed[k.toLowerCase()] === true);
    }
}
