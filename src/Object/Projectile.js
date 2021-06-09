import readonly from '@/utils/readonly';

export default class Projectile {
  @readonly
  static PROJECTILE_SPEED = 0.01;
  @readonly
  static PROJECTILE_KILL_RADIUS = 0.02;

  @readonly
  static SOURCE_SHOOTER = 1;
  @readonly
  static SOURCE_ENEMY = -1;

  /** @var {boolean} */
  alive = true;
  /** @var {number} */
  laneId;
  /** @var {number} */
  source;
  /** @var {number} */
  zPosition;
  /** @var {number} */
  zSpeed;

  constructor (laneId, source) {
    this.laneId = laneId;
    this.source = source;

    if (this.source === Projectile.SOURCE_SHOOTER) {
      this.zPosition = 0;
      this.zSpeed = Projectile.PROJECTILE_SPEED;
    } else {
      this.zPosition = 1;
      this.zSpeed = -Projectile.PROJECTILE_SPEED;
    }
  }

  update () {
    this.zSpeed += this.zSpeed;
  }

  /**
   * @param {object} laneObjects
   * @return {number} index of colliding object or -1
   */
  detectCollision (laneObjects) {
    let collision = laneObjects.findIndex(object => (
        object.zPosition >= this.zPosition - Projectile.PROJECTILE_KILL_RADIUS
        && object.zPosition <= this.zPosition + Projectile.PROJECTILE_KILL_RADIUS
      )
    );

    if (collision >= 0) {
      this.alive = false;
    }

    return collision;
  }
}
