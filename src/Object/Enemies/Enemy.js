import readonly from '@/utils/readonly';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';

export default class Enemy extends ShootingSurfaceObject {
  @readonly
  static LANE_CHANGE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {number} */
  firstLevel;
  /** @var {boolean} */
  canShoot = false;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, projectileManager, laneId, type) {
    super(surface, projectileManager, laneId, type);

    this.shootTimeoutMs = Enemy.SHOOT_TIMEOUT_MS;
    this.laneChangeTimeoutMs = Enemy.LANE_CHANGE_TIMEOUT_MS;
    this.zPosition = 1;

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  makeMove () {
    throw new Error('Method \'makeMove()\' must be implemented.');
  }

  updateState () {
    throw new Error('Method \'updateState()\' must be implemented.');
  }

  updateEntity () {
    throw new Error('Method \'updateEntity()\' must be implemented.');
  }

  update () {
    if (!this.alive) {
      return;
    }

    this.updateState();
    this.updateEntity();
  }
}
