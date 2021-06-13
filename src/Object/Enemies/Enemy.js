import SurfaceObject from '@/Object/Surface/SurfaceObject';
import Projectile from '@/Object/Projectiles/Projectile';
import readonly from '@/utils/readonly';

export default class Enemy extends SurfaceObject {
  @readonly
  static MOVE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {ProjectileManager} */
  projectileManager;

  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  lastShootTimestamp;

  /** @var {number} */
  state;
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
    super(surface, laneId, type);

    this.projectileManager = projectileManager;
    this.zPosition = 1;

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  makeMove () {
    throw new Error('Method \'makeMove()\' must be implemented.');
  }

  fire () {
    let now = Date.now();

    if (now - this.lastShootTimestamp < Enemy.SHOOT_TIMEOUT_MS) {
      return;
    }

    this.projectileManager.fire(this.laneId, Projectile.SOURCE_ENEMY, this.zPosition);
    this.lastShootTimestamp = now;
  }
}
