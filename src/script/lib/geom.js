import p5 from "p5";

export class Point3
{
  constructor(x, y, z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class PolarCoord3
{
  constructor(r, theta, phi = 0)
  {
    this.r = r;
    this.theta = theta;
    this.phi = phi;
  }

  toCartesian()
  {
    let x = this.r * Math.sin(this.theta) * Math.cos(this.phi);
    let y = this.r * Math.sin(this.theta) * Math.sin(this.phi);
    let z = this.r * Math.cos(this.theta);

    return new Point3(x, y, z);
  }

  toCartesianVector()
  {
    let x = this.r * Math.sin(this.theta) * Math.cos(this.phi);
    let y = this.r * Math.sin(this.theta) * Math.sin(this.phi);
    let z = this.r * Math.cos(this.theta);

    return new p5.Vector(x, y, z);
  }
}

export class PolarCoord2
{
  constructor(r, theta)
  {
    this.r = r;
    this.theta = theta;
  }

  toCartesian()
  {
    let x = this.r * Math.cos(this.theta);
    let y = this.r * Math.sin(this.theta);
    let z = 0.0;

    return new Point3(x, y, z);
  }

  toCartesianVector()
  {
    let x = this.r * Math.sin(this.theta) * Math.cos(this.phi);
    let y = this.r * Math.sin(this.theta) * Math.sin(this.phi);
    let z = 0

    return new p5.Vector(x, y, z);
  }
}