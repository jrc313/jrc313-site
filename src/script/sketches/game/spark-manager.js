import Point3 from "../../lib/geom.js";
import World from "./world.js";
import Ship from "./ship.js";
import SparkEmitter from "./spark-emitter.js";

export default class SparkManager
{

	sparkEmitters = [4];
    static PARTICLE_COUNT = 20;
    position;
    
    lowVelocity = new Point3(4, 2, 2);
    highVelocity = new Point3(5, 3, 3);
    
    constructor(position)
    {
    
        this.position = position.copyOf();
    
        // Bottom sparks
        this.sparkEmitters[0] = new SparkEmitter(SparkManager.PARTICLE_COUNT, Ship.SHIP_LENGTH, World.WORLD_HEIGHT, 0,
                                            position,
                                            new Point3(0, Ship.HALF_SHIP_WIDTH, Ship.HALF_SHIP_WIDTH),
                                            new Point3(-this.highVelocity.x, -this.highVelocity.y, this.lowVelocity.z),
                                            new Point3(-this.lowVelocity.x, -this.lowVelocity.y, this.highVelocity.z));
        this.sparkEmitters[1] = new SparkEmitter(SparkManager.PARTICLE_COUNT, Ship.SHIP_LENGTH, World.WORLD_HEIGHT, 0,
                                            position,
                                            new Point3(0, Ship.HALF_SHIP_WIDTH, -Ship.HALF_SHIP_WIDTH),
                                            new Point3(-this.highVelocity.x, -this.highVelocity.y, -this.highVelocity.z),
                                            new Point3(-this.lowVelocity.x, -this.lowVelocity.y, -this.lowVelocity.z));
        
        // Top sparks
        this.sparkEmitters[2] = new SparkEmitter(SparkManager.PARTICLE_COUNT, Ship.SHIP_LENGTH, World.WORLD_HEIGHT, 0,
                                            position,
                                            new Point3(0, -Ship.HALF_SHIP_WIDTH, Ship.HALF_SHIP_WIDTH),
                                            new Point3(-this.highVelocity.x, this.lowVelocity.y, this.lowVelocity.z),
                                            new Point3(-this.lowVelocity.x, this.highVelocity.y, this.highVelocity.z));
        this.sparkEmitters[3] = new SparkEmitter(SparkManager.PARTICLE_COUNT, Ship.SHIP_LENGTH, World.WORLD_HEIGHT, 0,
                                            position,
                                            new Point3(0, -Ship.HALF_SHIP_WIDTH, -Ship.HALF_SHIP_WIDTH),
                                            new Point3(-this.highVelocity.x, this.lowVelocity.y, -this.highVelocity.z),
                                            new Point3(-this.lowVelocity.x, this.highVelocity.y, -this.lowVelocity.z));
    }
    
    init()
    {
    	let i = 0;
        while (i < 4)
        {
            this.sparkEmitters[i++].killSparks();
        }
    }
    
    doTick(p5)
    {
        let i = 0;
        while (i < 4)
        {
            this.sparkEmitters[i++].doTick(p5);
        }
    }
    
    setPosition(p)
    {
        p.copyTo(this.position);
        if (p.y < World.MAX_SKIRTING_HEIGHT)
        {
            this.sparkEmitters[0].running = this.sparkEmitters[1].running = false;
            this.sparkEmitters[2].running = this.sparkEmitters[3].running = true;
        }
        else if (p.y > World.WORLD_HEIGHT - World.MAX_SKIRTING_HEIGHT)
        {
            this.sparkEmitters[0].running = this.sparkEmitters[1].running = true;
            this.sparkEmitters[2].running = this.sparkEmitters[3].running = false;
        }
        else
        {
            this.sparkEmitters[0].running = this.sparkEmitters[1].running = false;
            this.sparkEmitters[2].running = this.sparkEmitters[3].running = false;
        }
        let i = 0;
        while (i < 4)
        {
            p.copyTo(this.sparkEmitters[i++].position);
        }
    }
	
}
