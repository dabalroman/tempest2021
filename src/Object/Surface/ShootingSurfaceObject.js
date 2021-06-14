import SurfaceObject from '@/Object/Surface/SurfaceObject';
import Projectile from '@/Object/Projectiles/Projectile';

export default class ShootingSurfaceObject extends SurfaceObject {
  /** @var {ProjectileManager} */
  projectileManager;

  /** @var {number} */
  projectileSource;

  /** @var {number} */
  lastShootTimestamp;
  /** @var {number} */
  shootTimeoutMs;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, projectileManager, laneId, type) {
    super(surface, laneId, type);

    this.projectileManager = projectileManager;
    this.projectileSource = type === SurfaceObject.TYPE_SHOOTER ? Projectile.SOURCE_SHOOTER : Projectile.SOURCE_ENEMY;
  }

  fire () {
    let now = Date.now();

    if (now - this.lastShootTimestamp < this.shootTimeoutMs) {
      return;
    }

    this.projectileManager.fire(this.laneId, this.projectileSource, this.zPosition);
    this.lastShootTimestamp = now;
  }
}
