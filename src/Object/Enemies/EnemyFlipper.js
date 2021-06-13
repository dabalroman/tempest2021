import Enemy from '@/Object/Enemies/Enemy';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import randomRange from '@/utils/randomRange';

export default class EnemyFlipper extends Enemy {
  /**
   * @param {Surface} surface
   * @param {number} laneId
   */
  constructor (surface, laneId = 0) {
    super(surface, laneId, SurfaceObject.TYPE_FLIPPER);

    this.zSpeed = -randomRange(2, 8) * 0.001;
  }

  update () {
    if (!this.alive) {
      return;
    }

    if (this.zPosition <= 0) {
      this.zPosition = 1;
      this.setLane(randomRange(0, 16));
    }

    this.zPosition += this.zSpeed;
  }
}
