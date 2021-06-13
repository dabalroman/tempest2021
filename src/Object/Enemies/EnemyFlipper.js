import Enemy from '@/Object/Enemies/Enemy';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import randomRange from '@/utils/randomRange';

export default class EnemyFlipper extends Enemy {
  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, laneId = 0) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_FLIPPER);

    this.zSpeed = -randomRange(3, 6) * 0.001;
  }

  update () {
    if (!this.alive) {
      return;
    }

    if (this.zPosition <= 0) {
      this.zPosition = 1;
      this.setLane(randomRange(0, 16));
    }

    if (Math.random() > 0.98) {
      this.setLane(this.laneId + ((Math.random() > 0.5) ? 1 : -1));
    }

    if (Math.random() > 0.98) {
      this.fire();
    }

    this.zPosition += this.zSpeed;
  }

  hitByProjectile () {
    this.zPosition = 0;
  }
}
