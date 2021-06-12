import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/SurfaceObject';

export default class Shooter extends SurfaceObject {
  @readonly
  static MOVE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 200;

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
   * @param {Surface} surface
   * @param {number} desiredLane
   */
  moveToLane (surface, desiredLane) {
    let now = Date.now();

    if (now - this.lastLaneChangeTimestamp < Shooter.MOVE_TIMEOUT_MS) {
      return;
    }

    this.setLane(surface, desiredLane);
    surface.setActiveLane(this.laneId);

    this.lastLaneChangeTimestamp = now;
  }

  /**
   * @param {Surface} surface
   */
  moveLeft (surface) {
    this.moveToLane(surface, this.laneId + 1);
  }

  /**
   * @param {Surface} surface
   */
  moveRight (surface) {
    this.moveToLane(surface, this.laneId - 1);
  }

  shoot () {
    let now = Date.now();

    if (now - this.lastShootTimestamp < Shooter.SHOOT_TIMEOUT_MS) {
      return;
    }

    console.log('pow!');
    this.lastShootTimestamp = now;
  }
}
