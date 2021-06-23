import EnemyTanker from '@/Object/Enemies/EnemyTanker';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyPulsar from '@/Object/Enemies/EnemyPulsar';

export default class EnemyPulsarTanker extends EnemyTanker {
  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {function} rewardCallback
   * @param {number} laneId
   */
  constructor (
    surface,
    projectileManager,
    surfaceObjectsManager,
    rewardCallback,
    laneId = 0
  ) {
    super(surface, projectileManager, surfaceObjectsManager, rewardCallback, Enemy.TYPE_PULSAR_TANKER, laneId);

    this.firstLevel = 41;
  }

  createEnemies () {
    let CWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1);
    let canSpawnEnemyCW = CWLaneId !== this.laneId;
    let CWWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1);
    let canSpawnEnemyCCW = CWWLaneId !== this.laneId;

    let enemyCW = new EnemyPulsar(this.surface, this.projectileManager, this.rewardCallback, this.laneId);
    let enemyCCW = new EnemyPulsar(this.surface, this.projectileManager, this.rewardCallback, this.laneId);

    enemyCW.zPosition = this.zPosition;
    enemyCCW.zPosition = this.zPosition;

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

    this.surfaceObjectsManager.addEnemy(enemyCW);
    this.surfaceObjectsManager.addEnemy(enemyCCW);
  }
}
