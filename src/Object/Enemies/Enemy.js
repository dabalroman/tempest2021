import readonly from '@/utils/readonly';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';

export default class Enemy extends ShootingSurfaceObject {
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {number} */
  firstLevel;

  /** @var {number} */
  valueInPoints;

  /** @var {function} */
  rewardCallback;

  /** @var {boolean} */
  reward = false;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} rewardCallback
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, projectileManager, rewardCallback, laneId, type) {
    super(surface, projectileManager, laneId, type);

    this.zPosition = 1;

    this.rewardCallback = rewardCallback;
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

  hitByProjectile () {
    this.reward = true;
    this.die();
  }

  die () {
    this.hittable = false;
    this.canShoot = false;
    this.clearFlags();

    if (this.reward === true) {
      this.reward = false;
      this.rewardCallback(this.valueInPoints);
    }
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
