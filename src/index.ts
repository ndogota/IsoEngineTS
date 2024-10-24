import { Game } from './game';
import { Tile } from './tile';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

function init() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

    const game = new Game(canvas, ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    game.start();
}

window.addEventListener("load", init);