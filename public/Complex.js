class Complex {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  add(other) {
    return new Complex(this.a + other.a, this.b + other.b);
  }

  sub(other) {
    return new Complex(this.a - other.a, this.b - other.b);
  }

  scale(value) {
    return new Complex(this.a * value, this.b * value);
  }

  mult(other) {
    let a = this.a * other.a - this.b * other.b;
    let b = this.a * other.b + this.b * other.a;
    return new Complex(a, b);
  }

  sqrt() {
    let m = Math.sqrt(this.a * this.a + this.b * this.b);
    let angle = Math.atan2(this.b, this.a);
    m = Math.sqrt(m);
    angle = angle / 2;
    return new Complex(m * Math.cos(angle), m * Math.sin(angle));
  }
}
