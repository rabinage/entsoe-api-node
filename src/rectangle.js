/**
 * Since the release of the ECMAScript 6 (ES6 or ES2015) specification
 * it is possible to create objects using the `class` keyword.
 * You can read more about the example and the `class` keyword here:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes.
 */

export default class Rectangle {
  constructor(height, width) {
    if (!Number.isInteger(height) || !Number.isInteger(width)) {
      throw new Error("Rectangle height and width must be an integer.");
    }

    this.height = height;
    this.width = width;
  }

  // Getter
  get area() {
    return this.calcArea();
  }

  // Method
  calcArea() {
    return this.height * this.width;
  }

  static help() {
    // eslint-disable-next-line no-console
    console.log("Instantiate a rectangle: 'new Rectangle(height, width)'");
  }
}
