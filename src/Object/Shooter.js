import readonly from '@/utils/readonly';

export default class Shooter {
  @readonly
  static MOVE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 200;

  /** @var {number} */
  currentLane;
  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  lastShootTimestamp;

  constructor (currentLane = 0) {
    this.currentLane = currentLane;
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

    surface.setActiveLane(desiredLane);
    this.currentLane = surface.activeLane;
    this.lastLaneChangeTimestamp = now;
  }

  /**
   * @param {Surface} surface
   */
  moveLeft (surface) {
    this.moveToLane(surface, this.currentLane + 1);
  }

  /**
   * @param {Surface} surface
   */
  moveRight (surface) {
    this.moveToLane(surface, this.currentLane - 1);
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
