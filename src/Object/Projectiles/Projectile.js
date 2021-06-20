import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/Surface/SurfaceObject';

export default class Projectile extends SurfaceObject {
  @readonly
  static PROJECTILE_SPEED = 0.028;
  @readonly
  static PROJECTILE_KILL_RADIUS = 0.02;

  @readonly
  static SOURCE_SHOOTER = 1;
  @readonly
  static SOURCE_ENEMY = -1;

  /** @var {number} */
  source;

  /**
   * @param {Surface} surface
   * @param {number} laneId
   * @param {number} source
   * @param {?number} zPosition
   */
  constructor (surface, laneId, source, zPosition = null) {
    super(surface, laneId, SurfaceObject.TYPE_PROJECTILE);

    this.source = source;

    if (this.source === Projectile.SOURCE_SHOOTER) {
      this.zPosition = zPosition ?? 0;
      this.zSpeed = Projectile.PROJECTILE_SPEED;
    } else {
      this.zPosition = zPosition ?? 1;
      this.zSpeed = -Projectile.PROJECTILE_SPEED;
    }
  }

  update () {
    if (!this.alive) {
      return;
    }

    this.zPosition += this.zSpeed;

    this.alive = (
      (this.source === Projectile.SOURCE_SHOOTER && this.zPosition >= 1)
      || (this.source === Projectile.SOURCE_ENEMY && this.zPosition <= 0)
    ) === false;
  }

  /**
   * @param {array} laneObjects
   * @return {number} index of colliding object or -1
   */
  detectCollision (laneObjects) {
    if (!this.alive) {
      return -1;
    }

    let collision = laneObjects.findIndex(object => (
        object.zPosition >= this.zPosition - Projectile.PROJECTILE_KILL_RADIUS * 2
        && object.zPosition <= this.zPosition + Projectile.PROJECTILE_KILL_RADIUS
      )
    );

    if (collision >= 0) {
      laneObjects[collision].hitByProjectile();
      this.alive = false;
    }

    return collision;
  }

  hitByProjectile () {
    console.log('Projectile collision detected');
    this.alive = false;
  }
}
