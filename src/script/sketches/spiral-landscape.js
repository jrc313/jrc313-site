import {PolarCoord2} from "../lib/geom.js";

export default (sketch_width, sketch_height) => {

  return (p5) => {

    const CAMERA_X = 0.0, CAMERA_Y = -200.0, CAMERA_Z = -1300.0;
    const FRAME_RATE = 60;

    const POINT_COUNT = 5000;
    let points = new Array(POINT_COUNT);

    let rotate = true;
    let rotationY = 0, rotationZ = 0;
    let rotationYInc = 0, rotationZInc = 0;
    let FOUR_PI;

    let THETA_INC = 0.0;
    const R_INC = 0.0003;

    let xInc = 0.01;

    const SCALE = 840;
    let heightScale = 400;

    let iterations = 0;


    p5.setup = () =>
    {
        p5.createCanvas(sketch_width, sketch_height, p5.WEBGL);
        p5.frameRate(FRAME_RATE);
        p5.smooth();
        positionCamera();
        setConstants();
        reset();
    }

    function setConstants()
    {
        FOUR_PI = 4 * p5.PI;
        rotationYInc = -p5.PI / 360;
        rotationZInc = p5.PI / 360;
        THETA_INC = p5.PI / 60;
    }

    function drawAxes()
    {
      p5.strokeWeight(2);
      p5.stroke(255, 0, 0);
      p5.line(0, 0, 0, 200, 0, 0);
      p5.stroke(0, 255, 0);
      p5.line(0, 0, 0, 0, -200, 0);
      p5.stroke(0, 0, 255);
      p5.line(0, 0, 0, 0, 0, 200);
    }

    function positionCamera()
    {
        p5.camera(
                CAMERA_X, CAMERA_Y, CAMERA_Z,
                0, 0, 0,
                0, 1.0, 0
              );
    }

    p5.draw = () =>
    {
        p5.background(255, 255, 255);
        p5.stroke(150);

        p5.orbitControl();
        if (rotate)
        {
            rotationY += rotationYInc;
            if (rotationY >= p5.TWO_PI)
            {
                rotationY -= p5.TWO_PI;
            }
        }
        p5.rotateY(rotationY);
        
        let incrementValue = xInc;

        points[0].y = p5.noise(points[0].x, iterations * incrementValue, points[0].z);
        p5.beginShape();
        let i = 1;
        while (i < POINT_COUNT)
        {
            points[i].y = p5.noise(points[i].x, iterations * incrementValue, points[i].z);
            p5.stroke(p5.constrain(points[i].y * 255, 0, 255));

            p5.line(
                    points[i - 1].x * SCALE,
                    points[i - 1].y * heightScale,
                    points[i - 1].z * SCALE,
                    points[i].x * SCALE,
                    points[i].y * heightScale,
                    points[i].z * SCALE
                );
            i++;
        }
        p5.endShape();
        
        iterations++;

    }

    function reset()
    {
        p5.noiseSeed(p5.random(9999999));
        
        let i = 0;

        let theta = 0.0;
        let r = 0.0;

        while (i < POINT_COUNT)
        {
            let pc = new PolarCoord2(r, theta);
            let p = pc.toCartesian();
            p.z = p.y;
            p.y = p5.noise(p.x, 0, p.z);

            points[i] = p;

            r += R_INC;

            theta += THETA_INC;
            if (theta >= p5.TWO_PI)
            {
                theta -= p5.TWO_PI;
            }
            i++;
        }

        console.log(points);
    }

    function ord(c)
    {
      return c.charCodeAt(0);
    }

    p5.keyPressed = () =>
    {
        switch (p5.keyCode)
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
  }
}