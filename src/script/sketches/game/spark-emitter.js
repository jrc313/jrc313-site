import Point3 from "../../lib/geom.js";
import Particle from "./particle.js";

export default class SparkEmitter
{

	particles = [];

    length;
    halfLength;
    position; offset; minVelocity; maxVelocity;
    running = false;

    constructor(particleCount, length, floorHeight, ceilingHeight,
                position, offset, minVelocity, maxVelocity)
    {
    
        this.particles = [particleCount];
    
        this.length = length;
        this.halfLength = length >> 1;
    
        this.position = position.copyOf();
        this.offset = offset.copyOf();
        this.minVelocity = minVelocity.copyOf();
        this.maxVelocity = maxVelocity.copyOf();

        let i = particleCount;
        while (i-- > 0)
        {
            this.particles[i] = new Particle(floorHeight, ceilingHeight);
        }

    }

    start()
    {
        this.running = true;
    }

    stop()
    {
        this.running = false;
    }

    killSparks()
    {
    	let i = this.particles.length;
        while (i-- > 0)
        {
            this.particles[i].energy = 0;
        }
    }
    
    doTick(p5)
    {
        //p5.stroke(255, 102, 0, 100);
        let i = this.particles.length;
        while (i-- > 0)
        {
            this.particles[i].doTick();
        
            if (this.particles[i].energy <= 0 && this.running)
            {
                this.respawnParticle(i);
            }
            
            if (this.particles[i].energy > 0)
            {
            	//p5.stroke(255, 102, 0, 8.5 * particles[i].energy);
            	p5.stroke(255, 102 + (this.particles[i].energy * 10), 0, 150);
            	p5.line(this.particles[i].position.x, this.particles[i].position.y, this.particles[i].position.z,
                        this.particles[i].prevPosition.x, this.particles[i].prevPosition.y, this.particles[i].prevPosition.z);
            }
            
        }
    }

    respawnParticle(i)
    {
        let p = new Point3(this.random(-this.halfLength, this.halfLength) + this.position.x + this.offset.x, this.position.y + this.offset.y, this.position.z + this.offset.z);
        let v = new Point3(this.random(this.minVelocity.x, this.maxVelocity.x),
                            this.random(this.minVelocity.y, this.maxVelocity.y),
                            this.random(this.minVelocity.z, this.maxVelocity.z));
        this.particles[i].init(p, v, Math.floor(this.random(10, 20)));
    }
	
    random(min, max)
    {
    	return (Math.random() * (max - min)) + min;
    }
    
}
