import Enemy from '@/Object/Enemy';

export default class EnemyFlipper extends Enemy {
  /**
   * @param {Surface} surface
   * @param {number} laneId
   */
  constructor (surface, laneId = 0) {
    super(surface, laneId, Enemy.TYPE_FLIPPER);
  }
}
