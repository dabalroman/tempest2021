import EnemyTanker from '@/Object/Enemies/EnemyTanker';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';

export default class EnemyFuseballTanker extends EnemyTanker {
  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, surfaceObjectsManager, laneId = 0) {
    super(surface, projectileManager, surfaceObjectsManager, Enemy.TYPE_FUSEBALL_TANKER, laneId);
  }

  createEnemies () {
    let CWLaneId = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1);

    let enemyCW = new EnemyFuseball(this.surface, this.projectileManager, CWLaneId);
    let enemyCCW = new EnemyFuseball(this.surface, this.projectileManager, this.laneId);

    enemyCW.zPosition = this.zPosition;
    enemyCCW.zPosition = this.zPosition;

    enemyCW.setState(EnemyFuseball.STATE_MOVING_ALONG_LINE);
    enemyCW.immuneDuringNextLaneSwitch();

    this.surfaceObjectsManager.addEnemy(enemyCW);
    this.surfaceObjectsManager.addEnemy(enemyCCW);
  }
}
