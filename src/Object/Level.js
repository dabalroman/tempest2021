import Shooter from '@/Object/Shooter/Shooter';
import SurfaceObjectsManager from '@/Object/Manager/SurfaceObjectsManager';
import ProjectileManager from '@/Object/Manager/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import Projectile from '@/Object/Projectiles/Projectile';

export default class Level {
  /** @var {Surface} */
  surface;
  /** @var {Shooter} */
  shooter;
  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {ProjectileManager} */
  projectileManager;

  constructor (surface) {
    this.surface = surface;
    this.shooter = new Shooter(surface);
    this.surfaceObjectsManager = new SurfaceObjectsManager(surface);
    this.surfaceObjectsManager.addShooter(this.shooter);

    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, 0));
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, 5));
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, 12));

    this.projectileManager = new ProjectileManager(this.surfaceObjectsManager);
    this.projectileManager.fire(0, Projectile.SOURCE_ENEMY);

    keyboardInput.register('KeyA', () => {this.shooter.moveLeft();});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight();});
    keyboardInput.register('Space', () => {this.shooter.fire(this.projectileManager);});
  }

  update () {
    this.projectileManager.update();
    this.surfaceObjectsManager.update();
  }
}
