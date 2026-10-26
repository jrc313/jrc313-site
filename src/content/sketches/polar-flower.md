---
title: "Polar Flower"
description: "Randomly generated flowers"
pubDate: "26 Sep 2026"
heroImage: "../../assets/polar-flower.png"
sketchScript: "polar-flower"
---

This sketch generates random points in a polar coordinate system to produce a flower-like pattern, operating much like a three-dimensional Spirograph.

It starts by generating random increments for the $r$, $\theta$, and $\phi$ coordinates. A random range, $[r_{min}, r_{max}]$, is generated for the $r$ coordinate, while $\theta$ and $\phi$ operate within the fixed range $[0, 2\pi]$.

The first point always starts at $(r_{min}, 0, 0)$. The increments are then applied to each coordinate to generate the next point. The $r$ coordinate oscillates between $r_{min}$ and $r_{max}$, while the $\theta$ and $\phi$ coordinates wrap around when they reach the limits of their range.

The resulting points are converted to $\mathbb{R}^3$ space and rendered to the screen.

You can use the mouse to rotate around the axes and the mouse wheel to zoom. The following key controls are also available:

- **D** turn on debug mode and display the axes
- **X** toggle rotation on the x-axis
- **Y** toggle rotation on the y-axis
- **Z** toggle rotation on the z-axis
- Any other key start a new flower