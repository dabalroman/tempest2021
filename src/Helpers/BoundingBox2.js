import { Vector2 } from 'three';

export default class BoundingBox2 {
  /** @var {number} */
  #top;
  /** @var {number} */
  #right;
  /** @var {number} */
  #bottom;
  /** @var {number} */
  #left;
  /** @var {Vector2} */
  #center;

  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  constructor (top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;

    this.findCenter();
  }

  findCenter () {
    this.center = new Vector2(
      (this.left + this.right) / 2,
      (this.top + this.bottom) / 2
    );
  }

  /**
   * @return {Vector2}
   */
  getCenter () {
    return this.center;
  }

  /**
   * @param {Vector2[]} points
   * @return {BoundingBox2}
   */
  static create (points) {
    let top, right, bottom, left;

    let point = points.shift();
    top = bottom = point.y;
    left = right = point.x;

    points.forEach(point => {
      if (point.x < left) {
        left = point.x;
      }

      if (point.x > right) {
        right = point.x;
      }

      if (point.y > top) {
        top = point.y;
      }

      if (point.y < bottom) {
        bottom = point.y;
      }
    });

    return new BoundingBox2(top, right, bottom, left);
  }
}
