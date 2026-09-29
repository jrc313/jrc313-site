
let r, theta, phi;
let rInc, thetaInc, phiInc;

let FOUR_PI = 0;
let rMax, rMin;

let prevX, prevY, prevZ;

const MAX_ITERATIONS = 2500;
let iterations = 0;
let sk_rotationX = 0, sk_rotationY = 0, sk_rotationZ = 0;
let sk_rotationXInc = 0, sk_rotationYInc = 0, sk_rotationZInc = 0;
let sk_rotateX = false, sk_rotateY = true, sk_rotateZ = true;
const POINTS_PER_ITERATION = 4;

let points = [];
let minZ, maxZ;

const CAMERA_Z = 700;

let DEBUG = false;


class PolarCoord
{
  constructor(r, theta, phi)
  {
    this.r = r;
    this.theta = theta;
    this.phi = phi;
  }

  toCartesian()
  {
    let x = this.r * sin(this.theta) * cos(this.phi);
    let y = this.r * sin(this.theta) * sin(this.phi);
    let z = this.r * cos(this.theta);

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


function setConstants()
{
  FOUR_PI = 4 * PI;
  sk_rotationXInc = PI / 800;
  sk_rotationYInc = PI / 600;
  sk_rotationZInc = PI / 800;
}

function positionCamera()
{
  camera(
    100, -100, CAMERA_Z, 
    0, 0, 0, 
    0, 1.0, 0
    );
}

function setup()
{
  setConstants();
  let renderer = createP5Canvas(600, WEBGL);
  frameRate(60);
  noFill();
  smooth();
  positionCamera();

  background(255);
  reset();

  repositionCanvas();
}

function draw()
{
  background(255);


  orbitControl();
  if (DEBUG)
  {
    drawAxes();
  }

  if (iterations < MAX_ITERATIONS)
  {
    for (let i = 0; i < POINTS_PER_ITERATION; i++)
    {
      addPointToModel();
    }
  }
  if (iterations > 0)
  {
    drawModel();
  }
  if (iterations >= MAX_ITERATIONS)
  {
    reset();
  }
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

function addPointToModel()
{
  if (theta >= TWO_PI)
  {
    theta -= TWO_PI;
  }

  if (phi >= TWO_PI)
  {
    phi -= TWO_PI;
  }

  if (r > rMax || r < rMin)
  {
    rInc *= -1;
  }

  theta += thetaInc;
  phi += phiInc;
  r += rInc;

  points[iterations] = new PolarCoord(r, theta, phi).toCartesian();
  iterations++;
}

function drawModel()
{
  sk_rotateX && (sk_rotationX += sk_rotationXInc);
  if (sk_rotationX >= TWO_PI)
  {
    sk_rotationX -= TWO_PI;
  }
  rotateX(sk_rotationX);
  sk_rotateY && (sk_rotationY += sk_rotationYInc);
  if (sk_rotationY >= TWO_PI)
  {
    sk_rotationY -= TWO_PI;
  }
  rotateY(sk_rotationY);
  sk_rotateZ && (sk_rotationZ += sk_rotationZInc);
  if (sk_rotationZ >= TWO_PI)
  {
    sk_rotationZ -= TWO_PI;
  }
  rotateZ(sk_rotationZ);

  let i = 0;
  let currentPoint;
  noFill();
  stroke(50, 50, 100);
  strokeWeight(2);
  beginShape();
  while (i < iterations)
  {
    currentPoint = points[i];
    vertex(currentPoint.x, currentPoint.y, currentPoint.z);
    i++;
  }
  endShape();
  
  noStroke();
  fill(200, 50, 50);
  translate(currentPoint.x, currentPoint.y, currentPoint.z);
  sphere(4);
}

function reset()
{
  background(255);

  rMin = random(10, 50);
  rMax = random(rMin + 50, rMin + 300);
  rInc = random(0.1, 5.0);

  thetaInc = random(PI / 1000, PI / 100);
  phiInc = random(PI / 1000, PI / 100);

  theta = 0;
  phi = 0;
  r = rMin;

  iterations = 0;
  sk_rotationY = 0;
  sk_rotationZ = 0;

  addPointToModel();
}

function ord(c)
{
  return c.charCodeAt(0);
}

function keyReleased()
{
  console.log(`KEY: ${keyCode}`)
  switch (keyCode)
  {
    case ord('x'):
    case ord('X'):
      sk_rotateX = !sk_rotateX;
      break;
    case ord('y'):
    case ord('Y'):
      sk_rotateY = !sk_rotateY;
      break;
    case ord('z'):
    case ord('Z'):
      sk_rotateZ = !sk_rotateZ;
      break;
    case ord('d'):
    case ord('D'):
      DEBUG = !DEBUG;
      break;

    default:
      reset();
  }
}

