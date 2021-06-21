import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';

export default class EnemyFuseballRenderer extends EnemyRenderer {
  @readonly
  static ROTATION_SPEED = 0.02;

  one = false;

  /**
   * @param {EnemySpiker} enemySpiker
   * @param {Surface} surface
   */
  constructor (enemySpiker, surface) {
    super(enemySpiker, surface, Enemy.TYPE_FUSEBALL);
  }

  updatePosition () {
    // noinspection JSValidateTypes
    /** @var {EnemyFuseball} */
    let fuseball = this.object;

    this.positionBase = this.surface.lanesMiddleCoords[fuseball.laneId].clone();
    this.zRotationBase = 0;

    if (fuseball.inState(EnemyFuseball.STATE_SWITCHING_LANE) || fuseball.inState(EnemyFuseball.STATE_EXPLODING)) {
      if (fuseball.isFlagSet(EnemyFuseball.FLAG_SWITCHING_LANE_CCW)) {
        this.setLaneOffset(1 - fuseball.lastLaneSwitchingProgress);
      } else {
        this.setLaneOffset(fuseball.lastLaneSwitchingProgress);
      }
    } else {
      this.setLaneOffset(0);
    }

    if (fuseball.inState(EnemyFuseball.STATE_EXPLODING)) {
      //Temporary
      this.zRotationOffset--;
    } else {
      this.zRotationOffset += EnemyFuseballRenderer.ROTATION_SPEED;
    }
  }
}
