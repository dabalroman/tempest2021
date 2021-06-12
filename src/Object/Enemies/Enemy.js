import SurfaceObject from '@/Object/Surface/SurfaceObject';

export default class Enemy extends SurfaceObject {
  /** @var {number} */
  state;
  /** @var {number} */
  firstLevel;
  /** @var {boolean} */
  canShoot = false;

  /**
   * @param {Surface} surface
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, laneId, type) {
    super(surface, laneId, type);

    this.zPosition = 1;

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  makeMove () {
    throw new Error('Method \'makeMove()\' must be implemented.');
  }
}
