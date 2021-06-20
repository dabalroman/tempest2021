import Shooter from '@/Object/Shooters/Shooter';
import SurfaceObjectsManager from '@/Object/Manager/SurfaceObjectsManager';
import ProjectileManager from '@/Object/Manager/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import randomRange from '@/utils/randomRange';
import EnemySpiker from '@/Object/Enemies/EnemySpiker';

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
    this.surfaceObjectsManager = new SurfaceObjectsManager(surface);
    this.projectileManager = new ProjectileManager(this.surfaceObjectsManager);

    this.shooter = new Shooter(surface, this.projectileManager);
    this.surfaceObjectsManager.addShooter(this.shooter);
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, this.projectileManager, 0));
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, this.projectileManager, 5));
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, this.projectileManager, 12));
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, this.projectileManager, 15));
    this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, this.projectileManager, 2));

    keyboardInput.register('KeyA', () => {this.shooter.moveLeft();});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight();});
    keyboardInput.register('Space', () => {this.shooter.fire();});

    //Spawners
    keyboardInput.register('KeyF', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyFlipper(
          surface,
          this.projectileManager,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyS', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemySpiker(
          surface,
          this.projectileManager,
          randomRange(0, 15)
        )
      );
    });
  }

  update () {
    this.projectileManager.update();
    this.surfaceObjectsManager.update();
  }
}
