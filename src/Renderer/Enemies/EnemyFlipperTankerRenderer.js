import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyTanker from '@/Object/Enemies/EnemyTanker';

export default class EnemyFlipperTankerRenderer extends EnemyRenderer {
  /**
   * @param {EnemyFlipperTanker} enemyFlipperTanker
   * @param {Surface} surface
   */
  constructor (enemyFlipperTanker, surface) {
    super(enemyFlipperTanker, surface, Enemy.TYPE_FLIPPER_TANKER);
  }

  updatePosition () {
    this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
    this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];

    if (this.object.inState(EnemyTanker.STATE_EXPLODING)) {
      //Temporary
      this.zRotationOffset--;
    }
  }
}
