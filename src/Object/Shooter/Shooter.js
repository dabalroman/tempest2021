import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import Projectile from '@/Object/Projectiles/Projectile';

export default class Shooter extends SurfaceObject {
  @readonly
  static MOVE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  lastShootTimestamp;

  /**
   * @param {Surface} surface
   * @param {number} laneId
   */
  constructor (surface, laneId = 0) {
    super(surface, laneId, SurfaceObject.TYPE_SHOOTER);

    this.zPosition = -0.1;
  }

  update () {

  }

  /**
   * @param {number} desiredLane
   */
  moveToLane (desiredLane) {
    let now = Date.now();

    if (now - this.lastLaneChangeTimestamp < Shooter.MOVE_TIMEOUT_MS) {
      return;
    }

    this.setLane(desiredLane);
    this.surface.setActiveLane(this.laneId);

    this.lastLaneChangeTimestamp = now;
  }

  moveLeft () {
    this.moveToLane(this.laneId + 1);
  }

  moveRight () {
    this.moveToLane(this.laneId - 1);
  }

  /**
   * @param {ProjectileManager} projectileManager
   */
  fire (projectileManager) {
    let now = Date.now();

    if (now - this.lastShootTimestamp < Shooter.SHOOT_TIMEOUT_MS) {
      return;
    }

    projectileManager.fire(this.laneId, Projectile.SOURCE_SHOOTER);
    this.lastShootTimestamp = now;
  }
}
