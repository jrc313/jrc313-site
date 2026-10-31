import World from "./game/world.js";
import fontSrc from "./data/arial-black.ttf";

export default (sketch_width, sketch_height) => {

	return (p5) => {

		let world;
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
			p5.createCanvas(sketch_width, 400, p5.WEBGL);

			world = new World(p5, gameOver);
			p5.background(255, 255, 255);
			//gameImage = copy();
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
				case STATE_HIGH_SCORE:
					p5.push();
					p5.translate(0, 0, -2);
					p5.pop();
					world.renderScore();

					p5.text("Click to play!", p5.width - 150, 25);
					break;

			}

		}

		p5.mousePressed = () => {
			console.log(`State: ${state}`);
			switch (state) {
				case STATE_HIGH_SCORE:
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
			state = STATE_MENU;
		}

		function hideTable() {
			startGame();
		}

		function startGame() {
			state = STATE_PLAYING;
			world.init();
		}

		function blur(tt) {
			for (let ttt = 0; ttt <= tt; ttt++) {
				let R, G, B, left, right, top, bottom;
				let c, cl, cr, ct, cb;
				let w1 = p5.width - 1;
				let h1 = p5.height - 1;
				let index = 0;
				for (let y = 0; y < p5.height; y++) {
					top = (y > 0) ? -p5.width : h1 * p5.width;
					bottom = (y == h1) ? -h1 * p5.width : p5.width;
					for (let x = 0; x < p5.width; x++) {
						// Wraparound offsets
						left = (x > 0) ? -1 : w1;
						right = (x < w1) ? 1 : -w1;

						c = p5.pixels[index];
						cl = p5.pixels[left + index];
						cr = p5.pixels[right + index];
						ct = p5.pixels[top + index];
						cb = p5.pixels[bottom + index];

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