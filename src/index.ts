import { Game } from './game';
import { Tile } from './tile';

import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_WIDTH, TILE_HEIGHT } from './constants';

function init() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
    const tilesSet: Array<Tile> = new Array<Tile>();

    tilesSet.push(new Tile(TILE_WIDTH, TILE_HEIGHT, 0, 0, 0));

    const game = new Game(canvas, ctx, tilesSet, CANVAS_WIDTH, CANVAS_HEIGHT);
    game.start();
}

window.addEventListener("load", init);