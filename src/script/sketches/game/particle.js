import Point3 from "../../lib/geom.js";
import World from "./world.js";

export default class Particle
{

	position = new Point3(0, 0, 0); prevPosition = new Point3(0, 0, 0); velocity = new Point3(0, 0, 0);
    energy = 0;
    floorHeight; ceilingHeight;
    
    constructor(floorHeight, ceilingHeight)
    {
        this.floorHeight = floorHeight;
        this.ceilingHeight = ceilingHeight;
    }
    
    init(position, velocity, energy)
    {
    
        position.copyTo(this.position);
        position.copyTo(this.prevPosition);
        velocity.copyTo(this.velocity);

        this.energy = energy;
    }
    
    doTick()
    {
        
        if (this.position.y > this.floorHeight || this.position.y < this.ceilingHeight)
        {
            this.velocity.y *= -1;
        }
        
        this.velocity.y -= World.G;
        
        this.position.copyTo(this.prevPosition);
        this.position.add(this.velocity);
        
        this.energy--;
    }
	
}
