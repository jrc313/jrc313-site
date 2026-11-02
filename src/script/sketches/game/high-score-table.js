export default class HighScoreTable
{

	game;
	p5;
	
	name = "";
	score = 0;
	ticks = 0;
	
	levelReached = 0;
	barsPassed = 0;
	closeOneCount = 0;
	sneakyBuggerCount = 0;
	bestSparksFlying = 0;
	totalSparksFlying = 0;
	
	static MAX_ENTRIES = 5;
	static MAX_NAME_LENGTH = 6;
	static STORAGE_KEY = "scores";
	
	static BOX_WIDTH = 45;
	static BOX_SPACING = 4;
	
	static ROW_COUNT = 4;
	static COL_COUNT = 10;

	static STATE_SCORE_BREAKDOWN = 0;
	static STATE_ENTER_NAME = 1;
	static STATE_UPDATING = 2;
	static STATE_SHOW_TABLE = 4;
	
	state = HighScoreTable.STATE_SHOW_TABLE;

	hideTableFn;

	offsetX;
	offsetY;
	
	selected = -1;
	characters =	[
						['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
						['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
						['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
						['U', 'V', 'W', 'X', 'Y', 'Z', ' ', ' ', '<', '>']
					];
	
	scores = [["JRC313", 5000], ["AAAAAA", 4000], ["BBBBBB", 3000], ["CCCCCC", 2000], ["DDDDDD", 1]];
	
	constructor(p5, hideTableFn)
	{
		this.p5 = p5;
		this.hideTableFn = hideTableFn;
		this.offsetX = (this.p5.width - (HighScoreTable.BOX_WIDTH * HighScoreTable.COL_COUNT)) / 2;
		this.offsetY = (this.p5.height - (HighScoreTable.BOX_WIDTH * HighScoreTable.ROW_COUNT)) / 2;
		this.loadScores();
	}
	
	init(score, ticks, levelReached, barsPassed, closeOneCount,
		 sneakyBuggerCount, bestSparksFlying, totalSparksFlying)
	{
		this.selected = -1;
		this.state = HighScoreTable.STATE_SCORE_BREAKDOWN;
		this.score = score;
		this.ticks = ticks;
		this.levelReached = levelReached;
		this.barsPassed = barsPassed;
		this.closeOneCount = closeOneCount;
		this.sneakyBuggerCount = sneakyBuggerCount;
		this.bestSparksFlying = bestSparksFlying;
		this.totalSparksFlying = totalSparksFlying;
		
	}

	loadScores()
	{
		let scoreData = localStorage.getItem(HighScoreTable.STORAGE_KEY);
		if (scoreData == null || scoreData == "")
		{
			return;
		}
		try
		{
			let scores = JSON.parse(scoreData);
			this.scores = scores;
		}
		catch (error)
		{
			console.error(error);
		}
	}

	saveScores()
	{
		this.name == "" && (this.name = "------");
		this.scores.push([this.name, this.score]);
		this.scores = this.scores.sort((a, b) => a[1] < b[1]).slice(0, HighScoreTable.MAX_ENTRIES);
		localStorage.setItem(HighScoreTable.STORAGE_KEY, JSON.stringify(this.scores));
	}
	
	render()
	{
		switch (this.state)
		{
			case HighScoreTable.STATE_SCORE_BREAKDOWN:
				this.renderScoreBreakdown();
				break;
				
			case HighScoreTable.STATE_ENTER_NAME:
				this.renderNameEntry();
				break;
				
			case HighScoreTable.STATE_UPDATING:
				this.renderNameEntry();
				break;
				
			case HighScoreTable.STATE_SHOW_TABLE:
				this.renderTable();
				break;
		}
	}
	
	renderScoreBreakdown()
	{
		const maxTextWidth = 200;
		const maxScoreWidth = 100;
		const topY = 130;
		
		const tableWidth = (maxTextWidth + maxScoreWidth) + 30;
		const textX = (this.p5.width - tableWidth) / 2;
		
		this.p5.stroke(0, 0, 0);
		this.p5.fill(255, 255, 255);
		this.p5.rectMode(this.p5.CORNER);
		this.p5.rect(textX - 10, topY - 10, tableWidth + 20, 180);
		
		this.p5.fill(0, 0, 0);
		
		this.p5.textAlign(this.p5.CENTER);
		this.p5.text("Score Breakdown", this.p5.width / 2, topY - 30);

		this.p5.textAlign(this.p5.LEFT);
		this.p5.text("Level reached:", textX, topY + 20);
		this.p5.text("Bars passed:", textX, topY + 40);
		this.p5.text("Best sparks flying:", textX, topY + 60);
		this.p5.text("Total sparks flying:", textX, topY + 80);
		this.p5.text("Cutting it fine:", textX, topY + 100);
		this.p5.text("Sneaky buggers:", textX, topY + 120);
		this.p5.text("Score:", textX, topY + 160);

		this.p5.textAlign(this.p5.RIGHT);
		this.p5.text(this.levelReached, tableWidth + textX - 5, topY + 20);
		this.p5.text(this.barsPassed, tableWidth + textX - 5, topY + 40);
		this.p5.text(this.bestSparksFlying, tableWidth + textX - 5, topY + 60);
		this.p5.text(this.totalSparksFlying, tableWidth + textX - 5, topY + 80);
		this.p5.text(this.closeOneCount, tableWidth + textX - 5, topY + 100);
		this.p5.text(this.sneakyBuggerCount, tableWidth + textX - 5, topY + 120);
		this.p5.text(this.score, tableWidth + textX - 5, topY + 160);
		
	}
	
	renderNameEntry()
	{
		let i = 0;
		this.p5.push();
			this.p5.translate(this.offsetX, this.offsetY);
			for (let row = 0; row < this.characters.length; row++)
			{
				for (let col = 0; col < this.characters[row].length; col++)
				{
					const character = this.characters[row][col];
					const highlight = this.selected == character;
					this.renderChar(character, row, col, highlight);
					i++;
				}
			}
			this.p5.textAlign(this.p5.CENTER);
			let x = Math.floor(((HighScoreTable.COL_COUNT * HighScoreTable.BOX_WIDTH) / 2));
			let y = Math.floor((HighScoreTable.ROW_COUNT * HighScoreTable.BOX_WIDTH)) + 40;
			this.p5.fill(0, 0, 0);
			this.p5.text(this.name, x, y);
			x = ((HighScoreTable.COL_COUNT * HighScoreTable.BOX_WIDTH) / 2);
			y = -20;
			this.p5.text("Enter Your Name", x, y);
		this.p5.pop();
	}
	
	renderChar(character, row, col, highlighted)
	{
		if (character == ' ')
		{
			return;
		}
		let x = (col * HighScoreTable.BOX_WIDTH);
		let y = (row * HighScoreTable.BOX_WIDTH);
		const charWidth = 10;
		
		if (highlighted)
		{
			this.p5.noStroke();
			if (character == '<')
			{
				this.p5.fill(255, 100, 100);
			}
			else if (character == '>')
			{
				this.p5.fill(100, 200, 100);
			}
			else
			{
				this.p5.fill(100, 100, 200);
			}
			this.p5.rect(x + HighScoreTable.BOX_SPACING, y + HighScoreTable.BOX_SPACING,
						HighScoreTable.BOX_WIDTH - HighScoreTable.BOX_SPACING + 1, HighScoreTable.BOX_WIDTH - HighScoreTable.BOX_SPACING + 1);
		}
		else
		{
			this.p5.stroke(0, 0, 0);			
			this.p5.fill(255, 255, 255);
			this.p5.rect(x + HighScoreTable.BOX_SPACING, y + HighScoreTable.BOX_SPACING,
						HighScoreTable.BOX_WIDTH - HighScoreTable.BOX_SPACING, HighScoreTable.BOX_WIDTH - HighScoreTable.BOX_SPACING);
		}
		

		if (highlighted)
		{
			this.p5.fill(255, 255, 255);
		}
		else
		{
			this.p5.fill(0, 0, 0);
		}
		
		x += (HighScoreTable.BOX_WIDTH / 2) + HighScoreTable.BOX_SPACING;
		y += (HighScoreTable.BOX_WIDTH / 2);
		this.p5.push();
			// draw the characters 1 unit closer to the screen than the boxes
			// prevents any confusion as to which should be occluded 
			this.p5.translate(0, 0, 0.1);
			this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
			this.p5.text(character, x - 2, y);
		this.p5.pop();
		
	}
	
	renderTable()
	{
		const maxNameWidth = 150;
		const numberWidth = 30;
		const maxScoreWidth = 100;
		const tableWidth = (maxNameWidth + maxScoreWidth) + 30;
		const nameX = (this.p5.width - tableWidth) / 2;
		const scoreX = nameX + tableWidth;
		const topY = 140;
		
		this.p5.stroke(0, 0, 0);
		this.p5.fill(255, 255, 255);
		this.p5.rectMode(this.p5.CORNER);
		this.p5.rect(nameX - 10, topY - 25, tableWidth + 20, (this.scores.length * 30) + 10);
		
		this.p5.fill(0, 0, 0);
		for (let i = 0; i < this.scores.length; i++)
		{
			let y = (i * 30) + topY;
			let entryNumber = (i + 1) + ":";
			this.p5.textAlign(this.p5.LEFT);
			this.p5.text(entryNumber, nameX, y);
			this.p5.text(this.scores[i][0], nameX + numberWidth, y);
			this.p5.textAlign(this.p5.RIGHT);
			this.p5.text(this.scores[i][1], scoreX, y);
		}

	}
	
	getMouseCoords()
	{
		if (this.p5.touches.length > 0)
		{
			return {x: this.p5.touches[0].x, y: this.p5.touches[0].x};
		}
		else
		{
			return {x: this.p5.mouseX, y: this.p5.mouseY};
		}
	}

	mouseMoved()
	{
		switch (this.state)
		{
			case HighScoreTable.STATE_ENTER_NAME:

				const mouse = this.getMouseCoords();

				const fCol = (mouse.x - this.offsetX) / HighScoreTable.BOX_WIDTH;
				const fRow = (mouse.y - this.offsetY) / HighScoreTable.BOX_WIDTH;
				const col = fCol < 0 ? -1 : Math.floor(fCol);
				const row = fRow < 0 ? -1 : Math.floor(fRow);

				if (row < HighScoreTable.ROW_COUNT && col < HighScoreTable.COL_COUNT && row > -1 && col > -1)
				{
					if (this.characters[row][col] == ' ')
					{
						this.selected = -1;
					}
					else
					{
						this.selected = this.characters[row][col];
					}
				}
				else
				{
					this.selected = -1;
				}
				
				break;
				
			case HighScoreTable.STATE_SHOW_TABLE:
			
				break;
				
		}
		
	}
	
	mousePressed()
	{
		switch (this.state)
		{
			case HighScoreTable.STATE_SCORE_BREAKDOWN:
				if (this.scores.length < HighScoreTable.MAX_ENTRIES || this.score > this.scores[this.scores.length - 1][1])
				{
					this.state = HighScoreTable.STATE_ENTER_NAME;
				}
				else
				{
					this.state = HighScoreTable.STATE_SHOW_TABLE;
				}
				break;
			
			case HighScoreTable.STATE_ENTER_NAME:
				if (this.selected !== -1)
				{
					const character = this.selected;
					if (character == '<')
					{
						if (this.name.length > 0)
						{
							this.name = this.name.substring(0, this.name.length - 1);
						}
					}
					else if (character == '>')
					{
						this.state = HighScoreTable.STATE_UPDATING;
						this.saveScores();
						this.state = HighScoreTable.STATE_SHOW_TABLE;
					}
					else if (this.name.length < HighScoreTable.MAX_NAME_LENGTH)
					{
						this.name += character;
					}
				}
				break;
				
			case HighScoreTable.STATE_SHOW_TABLE:
				this.hideTableFn();
				break;
		}
	}
	
}
