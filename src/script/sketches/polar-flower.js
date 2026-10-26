import {PolarCoord3} from "../lib/geom.js";

export default (sketch_width, sketch_height) => {

  return (p5) => {

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

  const setConstants = () =>
  {
    FOUR_PI = 4 * p5.PI;
    sk_rotationXInc = p5.PI / 800;
    sk_rotationYInc = p5.PI / 600;
    sk_rotationZInc = p5.PI / 800;
  }

  const positionCamera = () =>
  {
    p5.camera(
      100, -100, CAMERA_Z, 
      0, 0, 0, 
      0, 1.0, 0
      );
  }

  p5.setup = () =>
  {
    setConstants();
    p5.createCanvas(sketch_width, sketch_height, p5.WEBGL);
    p5.frameRate(60);
    p5.smooth();
    positionCamera();

    p5.background(255);
    reset();
  }

  p5.draw = () =>
  {
    p5.background(255);


    p5.orbitControl();
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


  const drawAxes = () =>
  {
    p5.strokeWeight(2);
    p5.stroke(255, 0, 0);
    p5.line(0, 0, 0, 
      200, 0, 0);
    p5.stroke(0, 255, 0);
    p5.line(0, 0, 0, 
      0, -200, 0);
    p5.stroke(0, 0, 255);
    p5.line(0, 0, 0, 
      0, 0, 200);
  }

  const addPointToModel = () =>
  {
    if (theta >= p5.TWO_PI)
    {
      theta -= p5.TWO_PI;
    }

    if (phi >= p5.TWO_PI)
    {
      phi -= p5.TWO_PI;
    }

    if (r > rMax || r < rMin)
    {
      rInc *= -1;
    }

    theta += thetaInc;
    phi += phiInc;
    r += rInc;

    points[iterations] = new PolarCoord3(r, theta, phi).toCartesian();
    iterations++;
  }

  const drawModel = () =>
  {
    sk_rotateX && (sk_rotationX += sk_rotationXInc);
    if (sk_rotationX >= p5.TWO_PI)
    {
      sk_rotationX -= p5.TWO_PI;
    }
    p5.rotateX(sk_rotationX);
    sk_rotateY && (sk_rotationY += sk_rotationYInc);
    if (sk_rotationY >= p5.TWO_PI)
    {
      sk_rotationY -= p5.TWO_PI;
    }
    p5.rotateY(sk_rotationY);
    sk_rotateZ && (sk_rotationZ += sk_rotationZInc);
    if (sk_rotationZ >= p5.TWO_PI)
    {
      sk_rotationZ -= p5.TWO_PI;
    }
    p5.rotateZ(sk_rotationZ);

    let i = 0;
    let currentPoint;
    p5.noFill();
    p5.stroke(50, 50, 100);
    p5.strokeWeight(2);
    p5.beginShape();
    while (i < iterations)
    {
      currentPoint = points[i];
      p5.vertex(currentPoint.x, currentPoint.y, currentPoint.z);
      i++;
    }
    p5.endShape();
    
    p5.noStroke();
    p5.fill(200, 50, 50);
    p5.translate(currentPoint.x, currentPoint.y, currentPoint.z);
    p5.sphere(4);
  }

  const reset = () =>
  {
    p5.background(255);

    rMin = p5.random(10, 50);
    rMax = p5.random(rMin + 50, rMin + 300);
    rInc = p5.random(0.1, 5.0);

    thetaInc = p5.random(p5.PI / 1000, p5.PI / 100);
    phiInc = p5.random(p5.PI / 1000, p5.PI / 100);

    theta = 0;
    phi = 0;
    r = rMin;

    iterations = 0;
    sk_rotationY = 0;
    sk_rotationZ = 0;

    addPointToModel();
  }

  const ord = (c) =>
  {
    return c.charCodeAt(0);
  }

  p5.keyReleased = () =>
  {
    switch (p5.keyCode)
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

}};