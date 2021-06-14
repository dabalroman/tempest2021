import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';

export default class Shooter extends ShootingSurfaceObject {
  @readonly
  static LANE_CHANGE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  laneChangeTimeoutMs;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, laneId = 0) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_SHOOTER);

    this.shootTimeoutMs = Shooter.SHOOT_TIMEOUT_MS;
    this.laneChangeTimeoutMs = Shooter.LANE_CHANGE_TIMEOUT_MS;
    this.zPosition = 0;
  }

  update () {

  }

  /**
   * @param {number} desiredLane
   */
  moveToLane (desiredLane) {
    let now = Date.now();

    if (now - this.lastLaneChangeTimestamp < Shooter.LANE_CHANGE_TIMEOUT_MS) {
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
}
