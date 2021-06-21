import EnemyTanker from '@/Object/Enemies/EnemyTanker';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';

export default class EnemyFlipperTanker extends EnemyTanker {
  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, surfaceObjectsManager, laneId = 0) {
    super(surface, projectileManager, surfaceObjectsManager, Enemy.TYPE_FLIPPER_TANKER, laneId);
  }

  createEnemies () {
    let CWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1);
    let canSpawnEnemyCW = CWLaneId !== this.laneId;
    let CWWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1);
    let canSpawnEnemyCCW = CWWLaneId !== this.laneId;

    let enemyCW = new EnemyFlipper(this.surface, this.projectileManager, this.laneId);
    let enemyCCW = new EnemyFlipper(this.surface, this.projectileManager, this.laneId);

    enemyCW.zPosition = this.zPosition;
    enemyCCW.zPosition = this.zPosition;

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

    this.surfaceObjectsManager.addEnemy(enemyCW);
    this.surfaceObjectsManager.addEnemy(enemyCCW);
  }
}
