import World from "./game/world.js";
import fontSrc from "./data/arial-black.ttf";
import HighScoreTable from "./game/high-score-table.js";

export default (sketch_width, sketch_height) => {

	return (p5) => {

		let world;
		let highScoreTable;
		let font;

		const STATE_MENU = 1;
		const STATE_PLAYING = 2;
		const STATE_HIGH_SCORE = 4;

		let state = STATE_MENU;

		const FONT_SIZE = 20;

		let isSmooth = true;
		let isPaused = false;

		let gameImage;

		p5.setup = async () => {
			font = await p5.loadFont(fontSrc);
			
			p5.frameRate(50);
			let p5canvas = p5.createCanvas(sketch_width, 400, p5.WEBGL);
			let canvas = p5canvas.canvas;
			// Prevent presses from selecting elements on touch devices
			canvas.addEventListener("touchstart", (event) => event.preventDefault());
			canvas.addEventListener("touchmove", (event) => event.preventDefault());
			canvas.addEventListener("touchend", (event) => event.preventDefault());
			canvas.addEventListener("touchcancel", (event) => event.preventDefault());

			world = new World(p5, gameOver);
			highScoreTable = new HighScoreTable(p5, hideTable);
			p5.background(255, 255, 255);
		}

		p5.draw = () => {
			p5.textFont(font, FONT_SIZE);
			p5.background(255, 255, 255);
			p5.stroke(0);
			p5.translate(-360, -200, 0);
			if (isSmooth) {
				p5.smooth();
			}
			else {
				p5.noSmooth();
			}
			switch (state) {
				case STATE_PLAYING:
					if (isPaused) {
						p5.text("Paused", (p5.width >> 1) - 40, p5.height >> 1);
						return;
					}
					world.doTick();
					world.render();
					world.renderScore();
					break;

				case STATE_MENU:
					p5.textAlign(p5.LEFT);
					p5.text("Tunnel Flyer", 10, 25);
					highScoreTable.render();
					p5.textAlign(p5.RIGHT);
					p5.text("Click to play!", p5.width - 10, 25);
					break;
				case STATE_HIGH_SCORE:
					highScoreTable.render();
					if (highScoreTable.state == HighScoreTable.STATE_SHOW_TABLE)
					{
						p5.fill(0, 0, 0);
						p5.textAlign(p5.RIGHT);
						p5.text("Click to play!", p5.width - 10, 25);
					}
					else if (highScoreTable.state == HighScoreTable.STATE_SCORE_BREAKDOWN)
					{
						p5.fill(0, 0, 0);
						p5.textAlign(p5.RIGHT);
						p5.text("Click to continue!", p5.width - 10, 25);
					}
					break;

			}

		}

		p5.mouseMoved = () => {
			if (!world) { return; }
			if (world.state == World.STATE_GAME_OVER)
			{
				highScoreTable.mouseMoved();
			}
		}

		p5.mousePressed = () => {
			switch (state) {
				case STATE_HIGH_SCORE:
					highScoreTable.mousePressed();
					break;
				case STATE_MENU:
					startGame();
					break;
			}
		}

		p5.keyPressed = () => {
			switch (p5.key)
			{
				case 's':
				case 'S':
					isSmooth = !isSmooth;
					break;
				case 'd':
				case 'D':
					world.debug = !world.debug;
					break;
				case 'p':
				case 'P':
					state == STATE_PLAYING && (isPaused = !isPaused);
					break;
			}

			if (state == STATE_MENU)
			{
				startGame();
			}

		}

		function gameOver() {
			//blur(world.gameBuffer, 5);
			state = STATE_HIGH_SCORE;
			highScoreTable.init(world.score, world.gameTicks, world.level, world.barsPassed, world.closeOneCount,
								world.sneakyBuggerCount, world.bestSparksFlying, world.totalSparksFlying);
		}

		function hideTable() {
			startGame();
		}

		function startGame() {
			state = STATE_PLAYING;
			world.init();
		}

		function blur(buffer, tt) {
			buffer.loadPixels();
			for (let ttt = 0; ttt <= tt; ttt++) {
				let R, G, B, left, right, top, bottom;
				let c, cl, cr, ct, cb;
				let w1 = buffer.width - 1;
				let h1 = buffer.height - 1;
				let index = 0;
				for (let y = 0; y < buffer.height; y++) {
					top = (y > 0) ? -buffer.width : h1 * buffer.width;
					bottom = (y == h1) ? -h1 * buffer.width : buffer.width;
					for (let x = 0; x < buffer.width; x++) {
						// Wraparound offsets
						left = (x > 0) ? -1 : w1;
						right = (x < w1) ? 1 : -w1;

						c = buffer.pixels[index];
						cl = buffer.pixels[left + index];
						cr = buffer.pixels[right + index];
						ct = buffer.pixels[top + index];
						cb = buffer.pixels[bottom + index];

						// Calculate the sum of all neighbors
						R = ((cl >> 16 & 255) + (cr >> 16 & 255) + (c >> 16 & 255) + (ct >> 16 & 255) + (cb >> 16 & 255)) / 5;
						G = ((cl >> 8 & 255) + (cr >> 8 & 255) + (c >> 8 & 255) + (ct >> 8 & 255) + (cb >> 8 & 255)) / 5;
						B = ((cl & 255) + (cr & 255) + (c & 255) + (ct & 255) + (cb & 255)) / 5;
						p5.pixels[index++] = (R << 16) + (G << 8) + B;
					}
				}
			}
		}


	}
};