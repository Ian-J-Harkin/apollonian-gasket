class Gasket {
  constructor(x, y, r, c, seed, depth = 0) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = c;
    this.seed = seed;
    this.depth = depth;
    this.allCircles = [];
    this.queue = [];
    this.epsilon = 0.1;
    this.recursed = false;

    // Use seed for deterministic random
    randomSeed(this.seed);

    let c1 = new Circle(-1 / r, x, y);
    c1.color = this.color;
    
    let r2 = random(10, r / 2);
    let v = p5.Vector.fromAngle(random(TWO_PI));
    v.setMag(r - r2);
    let c2 = new Circle(1 / r2, x + v.x, y + v.y);
    c2.color = this.color;

    let r3 = v.mag();
    v.rotate(PI);
    v.setMag(r - r3);
    let c3 = new Circle(1 / r3, x + v.x, y + v.y);
    c3.color = this.color;

    this.allCircles = [c1, c2, c3];
    this.queue = [[c1, c2, c3]];

    // Generate fully
    while (true) {
      let len1 = this.allCircles.length;
      this.nextGeneration();
      let len2 = this.allCircles.length;
      if (len1 === len2) break;
    }
  }

  nextGeneration() {
    let nextQueue = [];
    for (let triplet of this.queue) {
      let [c1, c2, c3] = triplet;
      let k4 = descartes(c1, c2, c3);
      let newCircles = complexDescartes(c1, c2, c3, k4);

      for (let newCircle of newCircles) {
        newCircle.color = this.color;
        if (this.validate(newCircle, c1, c2, c3)) {
          this.allCircles.push(newCircle);
          nextQueue.push([c1, c2, newCircle]);
          nextQueue.push([c1, c3, newCircle]);
          nextQueue.push([c2, c3, newCircle]);
        }
      }
    }
    this.queue = nextQueue;
  }

  validate(c4, c1, c2, c3) {
    if (c4.radius < 2) return false;
    for (let other of this.allCircles) {
      let d = c4.dist(other);
      let radiusDiff = abs(c4.radius - other.radius);
      if (d < this.epsilon && radiusDiff < this.epsilon) return false;
    }
    if (!isTangent(c4, c1, this.epsilon)) return false;
    if (!isTangent(c4, c2, this.epsilon)) return false;
    if (!isTangent(c4, c3, this.epsilon)) return false;
    return true;
  }

  show() {
    for (let c of this.allCircles) {
      c.show();
    }
  }

  recurse() {
    if (this.recursed) return null;
    this.recursed = true;
    let nextGaskets = [];
    // Start from index 1 to skip the bounding circle (c1)
    for (let i = 1; i < this.allCircles.length; i++) {
      let c = this.allCircles[i];
      if (c.radius > 50) { // Arbitrary depth threshold to prevent infinite recursion
        // Calculate new color interpolated between col1 and col2 based on depth
        // The recursion loop in sketch.js runs 2 times, so max depth is 2.
        let newColor = lerpColor(col1, col2, (this.depth + 1) / 2);
        
        // Generate child gasket with new depth and color
        let nextG = new Gasket(c.center.a, c.center.b, c.radius, newColor, int(random(100000)), this.depth + 1);
        nextGaskets.push(nextG);
      }
    }
    return nextGaskets;
  }
}
