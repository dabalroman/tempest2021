import Projectile from '@/Object/Projectile';
import readonly from '@/utils/readonly';

export default class ProjectileManager {
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

    this.garbageCollector();
  }

  garbageCollector () {
    let indexOfAliveProjectile = this.shooterProjectiles.findIndex(projectile => projectile.alive);
    this.shooterProjectiles.slice(0, indexOfAliveProjectile + 1);

    indexOfAliveProjectile = this.enemyProjectiles.findIndex(projectile => projectile.alive);
    this.enemyProjectiles.slice(0, indexOfAliveProjectile + 1);
  }
}
