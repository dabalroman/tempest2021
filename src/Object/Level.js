import Shooter from '@/Object/Shooter/Shooter';
import SurfaceObjectsManager from '@/Object/Manager/SurfaceObjectsManager';
import ProjectileManager from '@/Object/Manager/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';

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

    let enemy1 = new EnemyFlipper(surface, 0);
    let enemy2 = new EnemyFlipper(surface, 0);
    enemy1.alive = false;

    this.surfaceObjectsManager.addEnemy(enemy1);
    this.surfaceObjectsManager.addEnemy(enemy2);

    this.projectileManager = new ProjectileManager(this.surfaceObjectsManager);

    keyboardInput.register('KeyA', () => {this.shooter.moveLeft(this.surface);});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight(this.surface);});
  }

  update () {
    this.projectileManager.update();
    this.surfaceObjectsManager.update();
  }
}
