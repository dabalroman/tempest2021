import EnemyTanker from '@/Object/Enemies/EnemyTanker';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';

export default class EnemyFuseballTanker extends EnemyTanker {
  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} enemySpawnFunction
   * @param {function} rewardCallback
   * @param {number} laneId
   * @param {number} zPosition
   */
  constructor (
    surface,
    projectileManager,
    enemySpawnFunction,
    rewardCallback,
    laneId = 0,
    zPosition = 1
  ) {
    super(
      surface,
      projectileManager,
      enemySpawnFunction,
      rewardCallback,
      Enemy.TYPE_FUSEBALL_TANKER,
      laneId,
      zPosition
    );

    this.firstLevel = 33;
  }

  createEnemies () {
    let CWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1);

    let enemyCW = this.enemySpawnFunction(CWLaneId, this.zPosition);
    let enemyCCW = this.enemySpawnFunction(this.laneId, this.zPosition);

    enemyCW.setState(EnemyFuseball.STATE_MOVING_ALONG_LINE);
    enemyCW.immuneDuringNextLaneSwitch();

    enemyCCW.setState(EnemyFuseball.STATE_MOVING_ALONG_LINE);
    enemyCCW.immuneDuringNextLaneSwitch();
  }
}
