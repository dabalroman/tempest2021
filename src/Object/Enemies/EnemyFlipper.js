import Enemy from '@/Object/Enemy';
import SurfaceObject from '@/Object/SurfaceObject';

export default class EnemyFlipper extends Enemy {
  /**
   * @param {Surface} surface
   * @param {number} laneId
   */
  constructor (surface, laneId = 0) {
    super(surface, laneId, SurfaceObject.TYPE_FLIPPER);
  }
}
