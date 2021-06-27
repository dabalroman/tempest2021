import EnemyTanker from '@/Object/Enemies/EnemyTanker';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';

export default class EnemyFlipperTanker extends EnemyTanker {
  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} enemySpawnFunction
   * @param {function} rewardCallback
   * @param {number} laneId
   * @param zPosition
   */
  constructor (
    surface,
    projectileManager,
    enemySpawnFunction,
    rewardCallback,
    laneId = 0,
    zPosition = 1
  ) {
    super(surface, projectileManager, enemySpawnFunction, rewardCallback, Enemy.TYPE_FLIPPER_TANKER, laneId, zPosition);

    this.firstLevel = 3;
  }

  createEnemies () {
    let CWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1);
    let canSpawnEnemyCW = CWLaneId !== this.laneId;
    let CWWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1);
    let canSpawnEnemyCCW = CWWLaneId !== this.laneId;

    let enemyCW = this.enemySpawnFunction(this.laneId, this.zPosition);
    let enemyCCW = this.enemySpawnFunction(this.laneId, this.zPosition);

    if (canSpawnEnemyCW) {
      enemyCW.setState(EnemyFlipper.STATE_ROTATING_BEGIN);
      enemyCW.setFlag(EnemyFlipper.FLAG_ROTATION_DIR_CHOSEN);
      enemyCW.setFlag(EnemyFlipper.FLAG_ROTATION_CCW);
      enemyCW.immuneDuringNextRotation();
    }

    if (canSpawnEnemyCCW) {
      enemyCCW.setState(EnemyFlipper.STATE_ROTATING_BEGIN);
      enemyCCW.setFlag(EnemyFlipper.FLAG_ROTATION_DIR_CHOSEN);
      enemyCCW.setFlag(EnemyFlipper.FLAG_ROTATION_CW);
      enemyCCW.immuneDuringNextRotation();
    }
  }
}
