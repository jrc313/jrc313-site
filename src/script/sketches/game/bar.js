import World from "./world.js"

export default class Bar
{
	static BAR_WIDTH = 10;
	static BAR_LENGTH = 100;
	static HALF_BAR_LENGTH = 50;
	static HALF_BAR_WIDTH = 5;

	h; x; z;
    prevH; prevX; prevZ;
    hVelocity = 0.0; xVelocity = -2.0;
    
    static BONUS_START_X = 300;
	static BONUS_TARGET_ALPHA = 50;
    static BONUS_ALPHA_SPEED = 0.5;
    
    bonusAlpha = 0;
    
    constructor(h, x, z)
    {
        this.prevH = this.h = h;
        this.prevX = this.x = x;
        this.prevZ = this.z = z;
    }
    
    render(p5)
    {
        
    	let x1 = this.x - Bar.HALF_BAR_WIDTH;
    	let x2 = this.x + Bar.HALF_BAR_WIDTH;
    	let y1 = (World.WORLD_HEIGHT - this.h) - Bar.HALF_BAR_WIDTH; 
    	let y2 = (World.WORLD_HEIGHT - this.h) + Bar.HALF_BAR_WIDTH;
    	let z1 = this.z - Bar.HALF_BAR_LENGTH;
    	let z2 = this.z + Bar.HALF_BAR_LENGTH;
    	
    	// Draw bar
    	p5.fill(130);
        //p5.stroke(120);
        p5.noStroke();

        p5.beginShape(p5.QUAD_STRIP);
        p5.vertex(x1, y1, z1);
        p5.vertex(x1, y2, z1);
        p5.vertex(x1, y1, z2);
        p5.vertex(x1, y2, z2);
        p5.vertex(x2, y1, z2);
        p5.vertex(x2, y2, z2);
        p5.vertex(x2, y1, z1);
        p5.vertex(x2, y2, z1);
        p5.vertex(x1, y1, z1);
        p5.vertex(x1, y2, z1);
        p5.endShape();

        p5.beginShape(p5.QUADS);
        p5.vertex(x1, y1, z1);
        p5.vertex(x2, y1, z1);
        p5.vertex(x2, y1, z2);
        p5.vertex(x1, y1, z2);
        p5.vertex(x1, y2, z1);
        p5.vertex(x1, y2, z2);
        p5.vertex(x2, y2, z2);
        p5.vertex(x2, y2, z1);
        p5.endShape();
        
        // Draw the shadows
        let shadowAlpha = Math.floor(((World.WORLD_HEIGHT - this.h) / World.WORLD_HEIGHT) * 220) + 25;
        p5.fill(150, 150, 150, shadowAlpha);
        p5.noStroke();
        // Draw the bottom shadow
        p5.beginShape(p5.QUADS);
        p5.vertex(x1, World.WORLD_HEIGHT - 0.1, z1);
        p5.vertex(x2, World.WORLD_HEIGHT - 0.1, z1);
        p5.vertex(x2, World.WORLD_HEIGHT - 0.1, z2);
        p5.vertex(x1, World.WORLD_HEIGHT - 0.1, z2);
        p5.endShape();
        
        if (this.x < Bar.BONUS_START_X)
        {
        	p5.noStroke();
        	
        	// Render top bonus
        	if (this.h > World.WORLD_HEIGHT - (World.WORLD_HEIGHT >> 2))
    		{
    			p5.fill(255, 0, 0, this.bonusAlpha);
    		}
    		else if (this.h > World.WORLD_HEIGHT >> 1)
    		{
    			p5.fill(255, 255, 0, this.bonusAlpha);
    		}
    		else
    		{
    			p5.fill(0, 255, 0, this.bonusAlpha);
    		}
        	y1 = 0;
        	y2 = World.WORLD_HEIGHT - this.h - Bar.HALF_BAR_WIDTH;
        	p5.beginShape(p5.QUADS);
        	p5.vertex(this.x, y1, z1);
        	p5.vertex(this.x, y2, z1);
        	p5.vertex(this.x, y2, z2);
        	p5.vertex(this.x, y1, z2);
        	p5.endShape();
        	
        	// Render bottom bonus
        	if (this.h < World.WORLD_HEIGHT >> 2)
    		{
    			p5.fill(255, 0, 0, this.bonusAlpha);
    		}
    		else if (this.h < World.WORLD_HEIGHT >> 1)
    		{
    			p5.fill(255, 255, 0, this.bonusAlpha);
    		}
    		else
    		{
    			p5.fill(0, 255, 0, this.bonusAlpha);
    		}
        	y1 = World.WORLD_HEIGHT - this.h + Bar.HALF_BAR_WIDTH;
        	y2 = World.WORLD_HEIGHT;
        	p5.beginShape(p5.QUADS);
        	p5.vertex(this.x, y1, z1);
        	p5.vertex(this.x, y2, z1);
        	p5.vertex(this.x, y2, z2);
        	p5.vertex(this.x, y1, z2);
        	p5.endShape();
        }
        
    }
    
    doTick()
    {
        this.prevX = this.x;
        this.prevH = this.h;
    	this.x += this.xVelocity;
        this.h += this.hVelocity;
        if (this.h <= Bar.HALF_BAR_WIDTH)
        {
        	this.h = Bar.HALF_BAR_WIDTH;
        	this.hVelocity *= -1;
        }
        
        if (this.h > World.WORLD_HEIGHT - Bar.HALF_BAR_WIDTH)
        {
        	this.h = World.WORLD_HEIGHT - Bar.HALF_BAR_WIDTH;
        	this.hVelocity *= -1;
        }
        
        if (this.x < Bar.BONUS_START_X && this.bonusAlpha <= Bar.BONUS_TARGET_ALPHA)
        {
        	this.bonusAlpha++;
        }
    }
    
    reset(new_h, new_x, new_hVelocity)
    {
    	this.h = new_h;
    	this.x = new_x;
    	this.hVelocity = new_hVelocity;
    	this.bonusAlpha = 0;
    }
}
