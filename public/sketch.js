let mode = 0; // 0 for original, 1 for complicated
let originalInitialized = false;
let complicatedInitialized = false;

// Variables for Original mode
let allCircles = [];
let queue = [];
let epsilon = 0.1;

// Variables for Complicated mode
let gaskets = [];
let seed;
let col1, col2;

function setup() {
  pixelDensity(displayDensity()); // High-DPI support for crisp fractals
  let sz = min(windowWidth * 0.92, 800);
  if (windowWidth < 500) sz = windowWidth - 32; // More space on small phones
  
  let canvas = createCanvas(sz, sz);
  canvas.parent('canvas-container');
  
  // Use touchStarted for better mobile response
  canvas.mousePressed(resetFractal);
  
  // Set up GUI button
  let btn = createButton('Switch to Complicated Version');
  btn.parent('canvas-container');
  btn.id('toggle-btn');
  btn.mousePressed((e) => {
    e.stopPropagation(); // Prevent canvas reset when clicking button
    mode = (mode + 1) % 2;
    if (mode === 0) {
      btn.html('Switch to Complicated Version');
      if (!originalInitialized) initOriginal();
      loop();
    } else {
      btn.html('Switch to Original Version');
      if (!complicatedInitialized) initComplicated();
      loop();
    }
  });

  // Ensure relative positioning for the container so absolute button works
  select('#canvas-container').style('position', 'relative');

  initOriginal(); // Default to original
}

function resetFractal() {
  if (mode === 0) {
    initOriginal();
  } else {
    initComplicated();
  }
  loop(); // Re-trigger drawing
  return false; // Prevent default touch behavior
}

function windowResized() {
  let sz = min(windowWidth * 0.92, 800);
  if (windowWidth < 500) sz = windowWidth - 32;
  resizeCanvas(sz, sz);
  resetFractal();
}

function initOriginal() {
  allCircles = [];
  queue = [];
  epsilon = 0.1;
  let r = min(width, height) / 2 - 20; // adding some padding
  let c1 = new Circle(-1 / r, width / 2, height / 2);
  let r2 = random(100, c1.radius / 2);
  let v = p5.Vector.fromAngle(random(TWO_PI));
  v.setMag(c1.radius - r2);
  let c2 = new Circle(1 / r2, width / 2 + v.x, height / 2 + v.y);
  let r3 = v.mag();
  v.rotate(PI);
  v.setMag(c1.radius - r3);
  let c3 = new Circle(1 / r3, width / 2 + v.x, height / 2 + v.y);
  
  c1.depth = 0;
  c2.depth = 0;
  c3.depth = 0;
  c1.color = getDepthColor(0);
  c2.color = getDepthColor(0);
  c3.color = getDepthColor(0);

  allCircles = [c1, c2, c3];
  queue = [[c1, c2, c3]];
  originalInitialized = true;
}

function initComplicated() {
  gaskets = [];
  col1 = color(112, 50, 126);
  col2 = color(45, 197, 244);
  seed = int(random(100000));
  console.log('Complicated Version Seed:', seed);

  let r = min(width, height) / 2 - 20;
  gaskets.push(new Gasket(width / 2, height / 2, r, col1, seed, 0));
  for (let n = 0; n < 2; n++) {
    for (let i = gaskets.length - 1; i >= 0; i--) {
      let nextG = gaskets[i].recurse();
      if (nextG) gaskets.push(...nextG);
    }
  }
  complicatedInitialized = true;
}

function draw() {
  if (mode === 0) {
    drawOriginal();
  } else {
    drawComplicated();
  }
}

function drawOriginal() {
  background('#0f172a');
  let len1 = allCircles.length;
  nextGenerationOriginal();
  let len2 = allCircles.length;
  if (len1 === len2) {
    noLoop();
  }
  for (let c of allCircles) {
    c.show();
  }
}

function nextGenerationOriginal() {
  let nextQueue = [];
  for (let triplet of queue) {
    let [c1, c2, c3] = triplet;
    let k4 = descartes(c1, c2, c3);
    let newCircles = complexDescartes(c1, c2, c3, k4);

    let newDepth = Math.max(c1.depth || 0, c2.depth || 0, c3.depth || 0) + 1;

    for (let newCircle of newCircles) {
      if (validateOriginal(newCircle, c1, c2, c3)) {
        newCircle.depth = newDepth;
        newCircle.color = getDepthColor(newDepth);
        allCircles.push(newCircle);
        let t1 = [c1, c2, newCircle];
        let t2 = [c1, c3, newCircle];
        let t3 = [c2, c3, newCircle];
        nextQueue = nextQueue.concat([t1, t2, t3]);
      }
    }
  }
  queue = nextQueue;
}

function validateOriginal(c4, c1, c2, c3) {
  if (c4.radius < 2) return false;
  for (let other of allCircles) {
    let d = c4.dist(other);
    let radiusDiff = abs(c4.radius - other.radius);
    if (d < epsilon && radiusDiff < epsilon) {
      return false;
    }
  }
  if (!isTangent(c4, c1, epsilon)) return false;
  if (!isTangent(c4, c2, epsilon)) return false;
  if (!isTangent(c4, c3, epsilon)) return false;
  return true;
}

function getDepthColor(depth) {
  let palettes = [
    '#e2e8f0', // Depth 0 (White/Gray)
    '#38bdf8', // Depth 1 (Cyan)
    '#818cf8', // Depth 2 (Indigo)
    '#c084fc', // Depth 3 (Purple)
    '#e879f9', // Depth 4 (Fuchsia)
    '#f472b6', // Depth 5 (Pink)
    '#fb7185', // Depth 6 (Rose)
    '#f43f5e'  // Depth 7+ (Red)
  ];
  return color(palettes[min(depth, palettes.length - 1)]);
}

function drawComplicated() {
  background(lerpColor(col1, color("#0f172a"), 0.5));
  for (let gasket of gaskets) {
    gasket.show();
  }
  noLoop(); // Full gasket generated in setup
}
