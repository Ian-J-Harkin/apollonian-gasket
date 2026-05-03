class Circle {
  constructor(bend, x, y) {
    this.center = new Complex(x, y);
    this.bend = bend;
    this.radius = Math.abs(1 / this.bend);
    this.color = null; // Can be assigned dynamically
  }

  show() {
    if (this.color) {
      stroke(this.color);
    } else {
      stroke('#38bdf8'); // Fallback accent color
    }
    noFill();
    strokeWeight(1.5);
    circle(this.center.a, this.center.b, this.radius * 2);
  }

  dist(other) {
    return dist(this.center.a, this.center.b, other.center.a, other.center.b);
  }
}
