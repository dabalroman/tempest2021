import Projectile from '@/Object/Projectiles/Projectile';
import readonly from '@/utils/readonly';
import FIFOManager from '@/Object/Manager/FIFOManager';

export default class ProjectileManager extends FIFOManager {
  @readonly
  static MAX_AMOUNT_OF_SHOOTER_PROJECTILES = 10;
  @readonly
  static MAX_AMOUNT_OF_ENEMY_PROJECTILES = 10;

  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;

  /** @var {Projectile[]} */
  shooterProjectiles = [];
  /** @var {Projectile[]} */
  enemyProjectiles = [];

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
        return;
      }

      this.shooterProjectiles.push(new Projectile(laneId, source));
    } else {
      if (this.enemyProjectiles.length >= ProjectileManager.MAX_AMOUNT_OF_ENEMY_PROJECTILES) {
        return;
      }

      this.enemyProjectiles.push(new Projectile(laneId, source));
    }
  }

  update () {
    this.shooterProjectiles.forEach(projectile => {
      projectile.update();
      projectile.detectCollision(this.surfaceObjectsManager.enemiesMap[projectile.laneId]);
    });

    this.enemyProjectiles.forEach(projectile => {
      projectile.update();
      projectile.detectCollision(this.surfaceObjectsManager.enemiesMap[projectile.laneId]);
    });

    const collectedShooterProjectiles = FIFOManager.garbageCollector(this.shooterProjectiles);
    const collectedEnemyProjectiles = FIFOManager.garbageCollector(this.enemyProjectiles);

    if (collectedShooterProjectiles) console.log(`Collected ${collectedShooterProjectiles} shooter projectiles.`);
    if (collectedEnemyProjectiles) console.log(`Collected ${collectedEnemyProjectiles} enemy projectiles`);
  }
}
