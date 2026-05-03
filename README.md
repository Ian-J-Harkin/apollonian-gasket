# Apollonian Gasket Explorer

An interactive, beautifully designed web and mobile application that dynamically renders the **Apollonian Gasket fractal** using [Descartes' Theorem](https://en.wikipedia.org/wiki/Descartes%27_theorem).

This project acts as an interactive mathematical toy, featuring two distinct modes and a fully responsive interface. Because it was built as a modern hybrid application using Capacitor, it functions seamlessly across Desktop Web Browsers, mobile Progressive Web Apps (PWAs), and native iOS/Android devices.

## Features

*   **Two Unique Rendering Modes:**
    *   **Original / Step-by-Step:** Watch the fractal generate layer by layer, with colors mapping to the depth of the recursive circles (from crisp white down to deep red).
    *   **Complicated / Recursive Gaskets:** A nested implementation where entire gaskets spawn inside the gaps of larger gaskets, featuring a smooth `lerpColor` gradient from purple to cyan to showcase true recursion depth.
*   **Interactive Generation:** Click anywhere on the canvas to instantly clear the screen and generate a mathematically unique fractal based on a new random seed.
*   **Fully Responsive:** The canvas automatically scales to fit narrow mobile screens or wide desktop monitors, recalculating dimensions on the fly.
*   **PWA Ready:** Complete with a manifest and service worker, allowing offline use and "Add to Home Screen" native-like installation.

## Tech Stack

*   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript
*   **Rendering Engine:** [p5.js](https://p5js.org/)
*   **Mobile / Native Wrapper:** [Capacitor by Ionic](https://capacitorjs.com/)

## Development & Deployment

For a comprehensive guide on how to edit the code, compile for iOS/Android, and deploy to Vercel, please refer to the **[howto.md](./howto.md)** file included in this repository. 
