---
title: "Spiral Landscape"
description: "Undulating spiral landscapes"
pubDate: "28 Sep 2026"
heroImage: "../../assets/spiral-landscape.png"
sketchScript: "spiral-landscape.js"
---

This sketch generates an Archimedean spiral in a polar coordinate system and uses Perlin noise to transform it into a three-dimensional, undulating surface.

It starts by generating points using polar coordinates, with $r$ initially set to zero and $\theta$ incremented by a fixed amount for each point. The radius is also increased by a fixed increment, $r_{inc}$, causing the points to form an expanding spiral. The $\theta$ coordinate wraps around when it reaches $2\pi$.

Each polar coordinate is converted to $\mathbb{R}^2$ space to determine the position of each point. A Perlin noise value is then calculated from the point's $x$ and $y$ coordinates to determine its height in the $z$-axis, creating a continuously varying surface across the spiral.

The points are connected sequentially to form a continuous spiral, with the resulting structure creating a three-dimensional, undulating surface. The entire structure rotates around the $y$-axis to provide different views of the form.

You can use the mouse to rotate around the axes and the mouse wheel to zoom. The following key controls are also available:

- **R** toggle rotation
- **SPACE** reset the Perlin noise function