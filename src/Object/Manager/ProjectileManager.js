import Projectile from '@/Object/Projectiles/Projectile';
import readonly from '@/utils/readonly';
import FIFOManager from '@/Object/Manager/FIFOManager';

export default class ProjectileManager extends FIFOManager {
  @readonly
  static MAX_AMOUNT_OF_SHOOTER_PROJECTILES = 8;
  @readonly
  static MAX_AMOUNT_OF_ENEMY_PROJECTILES = 32;

  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;

  /** @var {Projectile[]} */
  shooterProjectiles = [];
  /** @var {Projectile[]} */
  enemyProjectiles = [];

  /** @var {number[]} */
  rendererHelperNewProjectilesIds = [];

  /**
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   */
  constructor (surfaceObjectsManager) {
    super();

    this.surfaceObjectsManager = surfaceObjectsManager;
  }

  /**
   * @param {number} laneId
   * @param {number} source
   */
  fire (laneId, source) {
    if (source === Projectile.SOURCE_SHOOTER) {
      if (this.shooterProjectiles.length >= ProjectileManager.MAX_AMOUNT_OF_SHOOTER_PROJECTILES) {
        console.log('Too much shooter projectiles!');
        return;
      }

      this.shooterProjectiles.push(new Projectile(this.surfaceObjectsManager.surface, laneId, source));
      this.rendererHelperNewProjectilesIds.push(this.shooterProjectiles[this.shooterProjectiles.length - 1].objectId);
    } else {
      if (this.enemyProjectiles.length >= ProjectileManager.MAX_AMOUNT_OF_ENEMY_PROJECTILES) {
        console.log('Too much enemy projectiles!');
        return;
      }

      this.enemyProjectiles.push(new Projectile(this.surfaceObjectsManager.surface, laneId, source));
      this.rendererHelperNewProjectilesIds.push(this.enemyProjectiles[this.enemyProjectiles.length - 1].objectId);
    }
  }

  update () {
    this.shooterProjectiles.forEach(projectile => {
      projectile.update();
      projectile.detectCollision(this.surfaceObjectsManager.enemiesMap[projectile.laneId]);
    });

    this.enemyProjectiles.forEach(projectile => {
      projectile.update();
      projectile.detectCollision(this.surfaceObjectsManager.shootersMap[projectile.laneId]);
    });

    if (this.shouldTriggerGarbageCollector()) {
      const collectedShooterProjectiles = FIFOManager.garbageCollector(this.shooterProjectiles);
      const collectedEnemyProjectiles = FIFOManager.garbageCollector(this.enemyProjectiles);

      if (collectedShooterProjectiles) console.log(`Collected ${collectedShooterProjectiles} shooter projectiles.`);
      if (collectedEnemyProjectiles) console.log(`Collected ${collectedEnemyProjectiles} enemy projectiles`);
    }
  }
}
