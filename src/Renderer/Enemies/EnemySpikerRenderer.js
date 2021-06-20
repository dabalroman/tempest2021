import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';

export default class EnemySpikerRenderer extends EnemyRenderer {
  @readonly
  static ROTATION_SPEED = 0.1;

  /**
   * @param {EnemySpiker} enemySpiker
   * @param {Surface} surface
   */
  constructor (enemySpiker, surface) {
    super(enemySpiker, surface, Enemy.TYPE_SPIKER);

    this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
    this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];
  }

  updatePosition () {
    this.zRotationOffset += EnemySpikerRenderer.ROTATION_SPEED;
  }
}
