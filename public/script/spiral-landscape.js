

const CAMERA_X = 0.0, CAMERA_Y = -200.0, CAMERA_Z = -1300.0;
const SCREEN_WIDTH = 800, SCREEN_HEIGHT = 800;
const FRAME_RATE = 60;

const POINT_COUNT = 5000;
let points = new Array(POINT_COUNT);

let rotate = true;
let sk_rotationY = 0, sk_rotationZ = 0;
let sk_rotationYInc = 0, sk_rotationZInc = 0;

let THETA_INC = 0.0;
const R_INC = 0.0003;

let xInc = 0.01;

const SCALE = 840;
let heightScale = 400;

let iterations = 0;


function setup()
{
    let renderer = createP5Canvas(600, WEBGL);
    frameRate(FRAME_RATE);
    smooth();
    positionCamera();
    setConstants();
    reset();
    repositionCanvas();
}

function setConstants()
{
    FOUR_PI = 4 * PI;
    sk_rotationYInc = -PI / 360;
    sk_rotationZInc = PI / 360;
    THETA_INC = PI / 60;
}

function drawAxes()
{
  strokeWeight(2);
  stroke(255, 0, 0);
  line(0, 0, 0, 
    200, 0, 0);
  stroke(0, 255, 0);
  line(0, 0, 0, 
    0, -200, 0);
  stroke(0, 0, 255);
  line(0, 0, 0, 
    0, 0, 200);
}

function positionCamera()
{
    camera(
            CAMERA_X, CAMERA_Y, CAMERA_Z,
            0, 0, 0,
            0, 1.0, 0
          );
}

function draw()
{
    background(255, 255, 255);
    stroke(150);

    orbitControl();
    if (rotate)
    {
        sk_rotationY += sk_rotationYInc;
        if (sk_rotationY >= TWO_PI)
        {
            sk_rotationY -= TWO_PI;
        }
    }
    rotateY(sk_rotationY);
    
    let incrementValue = xInc;

    points[0].y = noise(points[0].x, iterations * incrementValue, points[0].z);
    beginShape();
    let i = 1;
    while (i < POINT_COUNT)
    {
        points[i].y = noise(points[i].x, iterations * incrementValue, points[i].z);
        stroke(constrain(points[i].y * 255, 0, 255));

        line(
                points[i - 1].x * SCALE,
                points[i - 1].y * heightScale,
                points[i - 1].z * SCALE,
                points[i].x * SCALE,
                points[i].y * heightScale,
                points[i].z * SCALE
            );
        i++;
    }
    endShape();
    
    iterations++;

}

function reset()
{
    noiseSeed(random(9999999));
    
    let i = 0;

    let theta = 0.0;
    let r = 0.0;

    while (i < POINT_COUNT)
    {
        let pc = new PolarCoord(r, theta);
        let p = pc.toCartesian();
        p.z = p.y;
        p.y = noise(p.x, 0, p.z);

        points[i] = p;

        r += R_INC;

        theta += THETA_INC;
        if (theta >= TWO_PI)
        {
            theta -= TWO_PI;
        }
        i++;
    }

    console.log(points);
}

function ord(c)
{
  return c.charCodeAt(0);
}

function keyPressed()
{
    switch (keyCode)
    {
        case ord('r'):
        case ord('R'):
            rotate = !rotate;
            break;
        case ord(' '):
            reset();
            break;
    }
}

class PolarCoord
{
  constructor(r, theta, phi = 0)
  {
    this.r = r;
    this.theta = theta;
    this.phi = phi;
  }

  toCartesian()
  {
    let x = this.r * cos(this.theta);
    let y = this.r * sin(this.theta);
    let z = 0.0;

    return new Point3D(x, y, z);
  }

  toCartesianVector()
  {
    let x = this.r * sin(this.theta) * cos(this.phi);
    let y = this.r * sin(this.theta) * sin(this.phi);
    let z = this.r * cos(this.theta);

    return createVector(x, y, z);
  }
}

class Point3D
{
  constructor(x, y, z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}