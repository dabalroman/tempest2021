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
    this.moveToLane(currentLane);
  }

  moveToLane (desiredLane) {
    let now = Date.now();

    if (now - this.lastLaneChangeTimestamp < Shooter.MOVE_TIMEOUT_MS) {
      return;
    }

    this.currentLane = desiredLane;
    this.lastLaneChangeTimestamp = now;
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
