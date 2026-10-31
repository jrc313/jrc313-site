import World from "./world.js";
import SparkManager from "./spark-manager.js";
import Point3 from "../../lib/geom.js";

export default class Ship
{
	static SHIP_LENGTH = 20;
	static SHIP_WIDTH = 10;
	static HALF_SHIP_LENGTH = 10;
	static HALF_SHIP_WIDTH = 5;
	
	static SHIP_THRUST = 0.15;
	
	h = 100.0;
	prevH = 0.0;
	hVelocity = 0.0;
	
	x; z;

	x1; x2;
    z1; z2;
	
	sparkManager;
	
    constructor(x, z)
    {
    	this.x = x;
    	this.z = z;
    	this.x1 = this.x - Ship.HALF_SHIP_LENGTH;
    	this.x2 = this.x + Ship.HALF_SHIP_LENGTH;
    	this.z1 = this.z - Ship.HALF_SHIP_WIDTH;
    	this.z2 = this.z + Ship.HALF_SHIP_WIDTH;
    	
    	this.sparkManager = new SparkManager(new Point3(this.x, (World.WORLD_HEIGHT - this.h), this.z));
    	
    }

    init(h)
    {
    	this.h = h;
    	this.hVelocity = 0;
    	this.sparkManager.setPosition(new Point3(this.x, (World.WORLD_HEIGHT - this.h), this.z));
    	this.sparkManager.init();
    }
    
    render(p5)
    {

        
        let y1 = (World.WORLD_HEIGHT - this.h) - Ship.HALF_SHIP_WIDTH;
        let y2 = (World.WORLD_HEIGHT - this.h) + Ship.HALF_SHIP_WIDTH;
        
        // Draw the ship
    	p5.fill(100, 100, 200);
        p5.noStroke();
        
        p5.beginShape(p5.QUAD_STRIP);
        p5.vertex(this.x1, y1, this.z1);
        p5.vertex(this.x1, y2, this.z1);
        p5.vertex(this.x1, y1, this.z2);
        p5.vertex(this.x1, y2, this.z2);
        p5.vertex(this.x2, y1, this.z2);
        p5.vertex(this.x2, y2, this.z2);
        p5.vertex(this.x2, y1, this.z1);
        p5.vertex(this.x2, y2, this.z1);
        p5.vertex(this.x1, y1, this.z1);
        p5.vertex(this.x1, y2, this.z1);
        p5.endShape();

        p5.beginShape(p5.QUADS);
        p5.vertex(this.x1, y1, this.z1);
        p5.vertex(this.x2, y1, this.z1);
        p5.vertex(this.x2, y1, this.z2);
        p5.vertex(this.x1, y1, this.z2);
        p5.vertex(this.x1, y2, this.z1);
        p5.vertex(this.x1, y2, this.z2);
        p5.vertex(this.x2, y2, this.z2);
        p5.vertex(this.x2, y2, this.z1);
        p5.endShape();
        
        // Draw the bottom shadow
        let shadowAlpha = Math.floor(((World.WORLD_HEIGHT - this.h) / World.WORLD_HEIGHT) * 220) + 25;
        p5.fill(150, 150, 150, shadowAlpha);
        p5.noStroke();

        p5.beginShape(p5.QUADS);
        p5.vertex(this.x1, World.WORLD_HEIGHT - 0.1, this.z1);
        p5.vertex(this.x2, World.WORLD_HEIGHT - 0.1, this.z1);
        p5.vertex(this.x2, World.WORLD_HEIGHT - 0.1, this.z2);
        p5.vertex(this.x1, World.WORLD_HEIGHT - 0.1, this.z2);
        p5.endShape();
        
        this.sparkManager.doTick(p5);
    }

    doTick(mousePressed)
    {
        // If the mouse is down, we are boosting so we apply thrust.
        // Otherwise gravity takes its toll.
        if (mousePressed)
        {
        	this.hVelocity += Ship.SHIP_THRUST;
        }
        else
        {
        	this.hVelocity += World.G;
        }
        
        // Apply force
        this.h += this.hVelocity;
        
        // Collision test
        if (this.h <= Ship.HALF_SHIP_WIDTH)
        {
            this.h = Ship.HALF_SHIP_WIDTH;
            this.hVelocity = 0;
        }
        if (this.h >= World.WORLD_HEIGHT)
        {
        	this.h = World.WORLD_HEIGHT - Ship.HALF_SHIP_WIDTH;
        	this.hVelocity = 0;
        }
        
        // Update spark manager position
        this.sparkManager.setPosition(new Point3(this.x, (World.WORLD_HEIGHT - this.h), this.z));
        
    }
}
