import readonly from '@/utils/readonly';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';

export default class Enemy extends ShootingSurfaceObject {
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {number} */
  firstLevel;
  /** @var {boolean} */
  canShoot = true;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, projectileManager, laneId, type) {
    super(surface, projectileManager, laneId, type);

    this.zPosition = 1;

    this.shootTimeoutMs = Enemy.SHOOT_TIMEOUT_MS;

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
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

    if (this.canChangeState()) {
      this.updateState();
    }

    this.updateEntity();
  }
}
