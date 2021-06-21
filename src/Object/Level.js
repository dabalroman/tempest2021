import Shooter from '@/Object/Shooters/Shooter';
import SurfaceObjectsManager from '@/Object/Manager/SurfaceObjectsManager';
import ProjectileManager from '@/Object/Manager/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import randomRange from '@/utils/randomRange';
import EnemySpiker from '@/Object/Enemies/EnemySpiker';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';
import EnemyFlipperTanker from '@/Object/Enemies/EnemyFlipperTanker';
import EnemyFuseballTanker from '@/Object/Enemies/EnemyFuseballTanker';

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
    this.surfaceObjectsManager.addEnemy(new EnemySpiker(surface, this.projectileManager, 2));
    this.surfaceObjectsManager.addEnemy(
      new EnemyFlipperTanker(surface, this.projectileManager, this.surfaceObjectsManager, 4)
    );
    this.surfaceObjectsManager.addEnemy(new EnemyFuseball(surface, this.projectileManager, 8));
    this.surfaceObjectsManager.addEnemy(
      new EnemyFuseballTanker(surface, this.projectileManager, this.surfaceObjectsManager, 10)
    );

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
