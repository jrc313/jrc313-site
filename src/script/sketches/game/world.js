import Bar from "./bar.js";
import Ship from "./ship.js";

export default class World
{

	static WORLD_HEIGHT = 200;
	static G = -0.1;

	static MAX_BARS = 8;
	static BAR_DISTANCE = 150;

	static WORLD_CENTER_X = 100;
    static WORLD_CENTER_Y = 50;
    static WORLD_CENTER_Z = 0;
    static TUNNEL_START_X = -100;
    static TUNNEL_END_X = 2000;
    
    static STATE_STARTING = 1;
    static STATE_PLAYING = 2;
    static STATE_DYING = 4;
    static STATE_GAME_OVER = 8;
    
	static START_DURATION = 135;

    static BONUS_FADE_SPEED = 3;			// Speed that the bonus text alpha channel decreases by.
    static MAX_SKIRTING_HEIGHT = 25;		// The threshold for the distance between the ship and
											// the floor or ceiling at which the ship is considered
											// to be "skirting".
    static MIN_SKIRTING_DURATION = 60;		// The minimum number of ticks that the ship must skirt
											// for to receive a bonus.
    
    static BONUS_TYPE_VERY_CLOSE_ONE = 1;
    static BONUS_TYPE_CLOSE_ONE = 2;
    static BONUS_TYPE_SKIRTING = 3;

    state;		// Current world state
    p5;			// P5 object
	gameOverFn;
    
	bars = [World.MAX_BARS];
    ship;
    shipThrusting = false;
    ticks = 0;
    gameTicks = 0;
    score = 0;
    level = 0;
    closestBar = 0;
    
	barsPassed = 0;
	closeOneCount = 0;
	sneakyBuggerCount = 0;
	bestSparksFlying = 0;
	totalSparksFlying = 0;
    
    // Bonus stuff
    closeOneHeight;				// distance between the bar and the ceiling or floor
    skirtingDuration;			// number of ticks the ship has been skirting the ceiling or floor
    bonusTextAlpha = 0;			// Bonus text alpha channel value
    bonusText = "";				// Current bonus text
    
    constructor(p5, gameOverFn)
    {
    	this.p5 = p5;
		this.gameOverFn = gameOverFn
    	this.ship = new Ship(World.WORLD_CENTER_X, World.WORLD_CENTER_Z);
		this.state = World.STATE_MENU;
    	this.init();
    }

    init()
    {
    	this.closeOneHeight = World.WORLD_HEIGHT;
    	this.skirtingDuration = 0;
    	this.bonusText = "";
    	this.bonusTextAlpha = 0;
    	this.gameTicks = 0;
    	this.score = 0;
		this.level = 1;
		this.barsPassed = 0;
		this.closeOneCount = 0;
		this.sneakyBuggerCount = 0;
		this.bestSparksFlying = 0;
		this.totalSparksFlying = 0;
		this.shipThrusting = false;
		
		this.setState(World.STATE_STARTING);
    	for (let i = 0; i < World.MAX_BARS; i++)
    	{
    		this.bars[i] = new Bar(this.p5.noise(i * 2) * World.WORLD_HEIGHT, World.WORLD_CENTER_X + World.BAR_DISTANCE * (i + 1), World.WORLD_CENTER_Z);
    		this.bars[i].hVelocity = 1 + (this.level / 4.0);
    		this.bars[i].hVelocity *= Math.random() > 0.5 ? 1 : -1;
    	}
    	this.closestBar = 0;
    	this.ship.init(World.WORLD_CENTER_Y);
		
    }
    
    setState(state)
    {
    	if (state == World.STATE_DYING)
    	{
    		this.gameTicks = this.ticks;
    	}
    	this.ticks = 0;
    	this.state = state;
    }
    
    doTick()
    {
    	switch (this.state)
		{
    		case World.STATE_STARTING:
    			this.doStartingTick();
    			break;
			
			case World.STATE_PLAYING:
    			this.doGameTick();
    			break;
    		
    		case World.STATE_DYING:
    			this.doDyingTick();
    			break;
		}
    	this.ticks++;
    }

    doStartingTick()
    {
    	if (this.ticks >= World.START_DURATION)
    	{
    		this.setState(World.STATE_PLAYING);
    	}
    }
    
    doGameTick()
    {
    	this.score++;
    	this.shipThrusting = this.p5.mouseIsPressed;
    	if (this.p5.keyIsPressed)
    	{
    		if (this.p5.key == ' ' || this.p5.keyCode == this.p5.UP_ARROW)
    		{
    			this.shipThrusting = true;
    		}
    	}
    	
    	this.ship.doTick(this.shipThrusting);
    	this.shipThrusting = false;
    	
    	if (this.ship.h <= Ship.HALF_SHIP_WIDTH || this.ship.h >= World.WORLD_HEIGHT - Ship.HALF_SHIP_WIDTH)
    	{
    		this.setState(World.STATE_DYING);
    		return;
    	}
        
		let i = this.bars.length;
        while (i-- > 0)
        {
        	if (this.bars[i].x <= -50)
        	{
        		let prevBar = i == 0 ? World.MAX_BARS - 1 : i - 1;
        		this.bars[i].reset(this.p5.noise(i * 2, this.bars[i].h) * World.WORLD_HEIGHT, this.bars[prevBar].x + World.BAR_DISTANCE, 1 + (this.level / 4.0));
        		this.bars[i].hVelocity *= Math.random() > 0.5 ? 1 : -1;
        	}
        	this.bars[i].doTick();
        	
        }
        
        // Test for collision
    	let bx1 = this.bars[this.closestBar].x;
    	let bx2 = this.bars[this.closestBar].x + Bar.BAR_WIDTH;
    	let by1 = this.bars[this.closestBar].h;
    	let by2 = this.bars[this.closestBar].h + Bar.BAR_WIDTH;
    	let sx1 = World.WORLD_CENTER_X;
    	let sx2 = World.WORLD_CENTER_X + Ship.SHIP_LENGTH;
    	let sy1 = this.ship.h;
    	let sy2 = this.ship.h + Ship.SHIP_WIDTH;
    	
    	let xPlaneColliding = (bx1 < sx2 && bx2 > sx1);
    	let yPlaneColliding = (by1 < sy2 && by2 > sy1);
    	
    	if (xPlaneColliding && yPlaneColliding)
    	{
    		this.setState(World.STATE_DYING);
    		return;
    	}
    	
    	let prevLevel = this.level;
    	this.level = Math.abs(this.ticks / 1000) + 1;
    	
    	if (prevLevel != this.level)
    	{
    		let hVelocity = 1 + (this.level / 4.0);
    		i = this.bars.length;
            while (i-- > 0)
            {
            	this.bars[i].hVelocity = this.bars[i].hVelocity > 0 ? hVelocity : -hVelocity; 
            }
    	}

    	this.testBonuses();
    	
        // Set the closest bar
        if (this.bars[this.closestBar].x + Bar.HALF_BAR_WIDTH < World.WORLD_CENTER_X - Ship.HALF_SHIP_LENGTH)
        {
        	this.closestBar++;
    		if (this.closestBar >= World.MAX_BARS)
    		{
    			this.closestBar = 0;
    		}
    		this.barsPassed++;
        }
    }
    
    testBonuses()
    {
    	// Test for bonuses
    	
    	// Close one bonus
    	if (this.ship.x1 < this.bars[this.closestBar].x && this.ship.x2 > this.bars[this.closestBar].x)
    	{
    		// The ship is in the bonus area. Check how narrow the gap is. 
    		let currentCloseOneHeight = this.bars[this.closestBar].h < this.ship.h ? World.WORLD_HEIGHT - this.bars[this.closestBar].h : this.bars[this.closestBar].h;
    		if (currentCloseOneHeight < this.closeOneHeight)
    		{
    			this.closeOneHeight = currentCloseOneHeight;
    		}
    	}
    	else if (this.bars[this.closestBar].x + Bar.HALF_BAR_WIDTH < World.WORLD_CENTER_X - Ship.HALF_SHIP_LENGTH)
    	{
    		// The ship has just passed the bar. Time to award bonuses if necessary.
    		if (this.closeOneHeight < World.WORLD_HEIGHT >> 2)
    		{
    			this.awardBonus(World.BONUS_TYPE_VERY_CLOSE_ONE, 500);
    		}
    		else if (this.closeOneHeight < World.WORLD_HEIGHT >> 1)
    		{
    			this.awardBonus(World.BONUS_TYPE_CLOSE_ONE, 50);
    		}
    		this.closeOneHeight = World.WORLD_HEIGHT;
    	}
    	
    	if (this.ship.h < World.MAX_SKIRTING_HEIGHT || (World.WORLD_HEIGHT - this.ship.h) < World.MAX_SKIRTING_HEIGHT)
    	{
    		this.skirtingDuration++;
    	}
    	else
    	{
    		if (this.skirtingDuration > World.MIN_SKIRTING_DURATION)
    		{
        		this.awardBonus(World.BONUS_TYPE_SKIRTING, this.skirtingDuration);
        	}
    		this.skirtingDuration = 0;
    	}
    	
    	if (this.bonusTextAlpha > 0)
    	{
    		this.bonusTextAlpha -= World.BONUS_FADE_SPEED;
    	}
    	
    }

	awardBonus(bonusType, bonusScore)
	{
		this.score += bonusScore;
		switch (bonusType)
		{
			case World.BONUS_TYPE_CLOSE_ONE:
				this.bonusText = "Cutting it fine! +" + bonusScore;
				this.closeOneCount++;
				break;
				
			case World.BONUS_TYPE_SKIRTING:
				this.bonusText = "Sparks flying! +" + bonusScore;
				this.totalSparksFlying += bonusScore;	
				if (bonusScore > this.bestSparksFlying)
				{
					this.bestSparksFlying = bonusScore;
				}
				break;
				
			case World.BONUS_TYPE_VERY_CLOSE_ONE:
				this.bonusText = "Sneaky bugger!!! +" + bonusScore;
				this.sneakyBuggerCount++;
				break;
		}
		
		this.bonusTextAlpha = 255;
		
	}

	doDyingTick()
    {
    	if (this.ticks > 45)
    	{
    		this.renderDying();
    		this.gameOverFn();
    		this.setState(World.STATE_GAME_OVER);
    	}
    }
	
    render()
    {
    	switch (this.state)
		{
			case World.STATE_STARTING:
				this.renderStarting();
				break;
			
			case World.STATE_PLAYING:
    			this.renderGame();
    			break;
    		
    		case World.STATE_DYING:
    			this.renderDying();
    			break;
		}
    }
    
    renderStarting()
    {
    	this.renderGame();
    	
    	let timeRemaining = 3 - (this.ticks / 45);
    	let msg = "Starting in " + timeRemaining; 

		this.p5.fill(0, 0, 0);
		this.p5.text(msg, 10, this.p5.height >> 1);

    }
    
    renderGame()
    {
    	this.p5.push();
	    	this.p5.rotateY(this.p5.PI / 8);
	    	this.p5.translate(40, 70, 0);
	
	    	//this.p5.stroke(0, 0, 0, 50);
	    	this.p5.noStroke();
	    	this.p5.fill(200, 200, 200, 100);
	    	// draw ceiling
	    	this.p5.beginShape(this.p5.QUADS);
	    	this.p5.vertex(World.TUNNEL_START_X, 0, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_END_X, 0, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_END_X, 0, Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_START_X, 0, Bar.HALF_BAR_LENGTH);
	    	this.p5.endShape();
	    	
	    	// draw floor
	    	this.p5.beginShape(this.p5.QUADS);
	    	this.p5.vertex(World.TUNNEL_START_X, World.WORLD_HEIGHT, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_END_X, World.WORLD_HEIGHT, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_END_X, World.WORLD_HEIGHT, Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_START_X, World.WORLD_HEIGHT, Bar.HALF_BAR_LENGTH);
	    	this.p5.endShape();
	    	
	    	this.p5.fill(200, 200, 200, 50);
	    	// draw back panel
	    	this.p5.beginShape(this.p5.QUADS);
	    	this.p5.vertex(World.TUNNEL_START_X, 0, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_END_X, 0, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_END_X, World.WORLD_HEIGHT, -Bar.HALF_BAR_LENGTH);
	    	this.p5.vertex(World.TUNNEL_START_X, World.WORLD_HEIGHT, -Bar.HALF_BAR_LENGTH);
	    	this.p5.endShape();
	    	
	        for (let i = 0; i < this.bars.length; i++)
	        {
	            /* DEBUG
	        	this.p5.push();
	            	this.p5.fill(0, 0, 0);
					this.p5.translate(this.bars[i].x + Bar.HALF_BAR_WIDTH, World.WORLD_HEIGHT - this.bars[i].h, Bar.HALF_BAR_LENGTH);
	        		this.p5.text("i: " + i, 0, -10);
	        		this.p5.text("h: " + this.bars[i].h, 0, 10);
	        		this.p5.text("v: " + this.bars[i].hVelocity, 0, 30);
        		this.p5.pop();
        		*/
	        	this.bars[i].render(this.p5);
	        }

        	/* DEBUG
	        this.p5.push();
            	this.p5.fill(0, 0, 0);
				this.p5.translate(this.ship.x2 + 5, World.WORLD_HEIGHT - this.ship.h, 0);
        		this.p5.text("h: " + (int)this.ship.h, 0, 10);
    		this.p5.pop();
    		*/
	        
	        this.ship.render(this.p5);
	    this.p5.pop();
	    this.p5.fill(0, 0, 0, this.bonusTextAlpha);
	    this.p5.text(this.bonusText, 10, this.p5.height - 15);
    }
    
    renderScore()
    {
    	this.p5.fill(0, 0, 0);
        this.p5.text("Score: " + this.score, 10, 25);
        this.p5.text("Level: " + this.level, 10, 45);
    }
    
    renderDying()
    {
    	this.p5.push();
    		this.p5.translate(-this.ticks * 5, 0, -this.ticks * 6);
    		this.renderGame();
    	this.p5.pop();
    }
    
    renderGameOver()
    {
    	this.p5.fill(255, 0, 0);
    	this.p5.text("Game Over!", 100, 45);
    }
	
}
