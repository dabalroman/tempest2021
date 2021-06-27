import EnemyTanker from '@/Object/Enemies/EnemyTanker';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyPulsar from '@/Object/Enemies/EnemyPulsar';

export default class EnemyPulsarTanker extends EnemyTanker {
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
    super(surface, projectileManager, enemySpawnFunction, rewardCallback, Enemy.TYPE_PULSAR_TANKER, laneId, zPosition);

    this.firstLevel = 41;
  }

  createEnemies () {
    let CWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1);
    let canSpawnEnemyCW = CWLaneId !== this.laneId;
    let CWWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1);
    let canSpawnEnemyCCW = CWWLaneId !== this.laneId;

    let enemyCW = this.enemySpawnFunction(this.laneId, this.zPosition);
    let enemyCCW = this.enemySpawnFunction(this.laneId, this.zPosition);

    if (canSpawnEnemyCW) {
      enemyCW.setState(EnemyPulsar.STATE_ROTATING_BEGIN);
      enemyCW.setFlag(EnemyPulsar.FLAG_ROTATION_DIR_CHOSEN);
      enemyCW.setFlag(EnemyPulsar.FLAG_ROTATION_CCW);
      enemyCW.immuneDuringNextRotation();
    }

    if (canSpawnEnemyCCW) {
      enemyCCW.setState(EnemyPulsar.STATE_ROTATING_BEGIN);
      enemyCCW.setFlag(EnemyPulsar.FLAG_ROTATION_DIR_CHOSEN);
      enemyCCW.setFlag(EnemyPulsar.FLAG_ROTATION_CW);
      enemyCCW.immuneDuringNextRotation();
    }
  }
}
