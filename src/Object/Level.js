import Shooter from '@/Object/Shooters/Shooter';
import SurfaceObjectsManager from '@/Object/Manager/SurfaceObjectsManager';
import ProjectileManager from '@/Object/Manager/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import randomRange from '@/utils/randomRange';
import EnemySpiker from '@/Object/Enemies/EnemySpiker';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';
import EnemyPulsar from '@/Object/Enemies/EnemyPulsar';
import EnemyPulsarTanker from '@/Object/Enemies/EnemyPulsarTanker';
import EnemyFuseballTanker from '@/Object/Enemies/EnemyFuseballTanker';
import EnemyFlipperTanker from '@/Object/Enemies/EnemyFlipperTanker';

export default class Level {
  /** @var {Surface} */
  surface;
  /** @var {Shooter} */
  shooter;
  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {ProjectileManager} */
  projectileManager;

  /** @var {function} */
  rewardCallback;
  /** @var {function} */
  levelWonCallback;
  /** @var {function} */
  shooterKilledCallback;

  /**
   * @param {Surface} surface
   * @param {function} rewardCallback
   * @param {function} levelWonCallback
   * @param {function} shooterKilledCallback
   */
  constructor (surface, rewardCallback, levelWonCallback, shooterKilledCallback) {
    this.surface = surface;
    this.rewardCallback = rewardCallback;
    this.levelWonCallback = levelWonCallback;
    this.shooterKilledCallback = shooterKilledCallback;

    this.surfaceObjectsManager = new SurfaceObjectsManager(surface);
    this.projectileManager = new ProjectileManager(this.surfaceObjectsManager);

    this.shooter = new Shooter(surface, this.projectileManager, this.surfaceObjectsManager, 6);
    this.surfaceObjectsManager.addShooter(this.shooter);

    // this.surfaceObjectsManager.addEnemy(new EnemyFlipper(surface, this.projectileManager, this.rewardCallback, 0));
    // this.surfaceObjectsManager.addEnemy(new EnemySpiker(surface, this.projectileManager, this.rewardCallback, 2));
    // this.surfaceObjectsManager.addEnemy(
    //   new EnemyFlipperTanker(surface, this.projectileManager, this.surfaceObjectsManager, this.rewardCallback, 4)
    // );
    // this.surfaceObjectsManager.addEnemy(new EnemyFuseball(surface, this.projectileManager, this.rewardCallback, 8));
    // this.surfaceObjectsManager.addEnemy(
    //   new EnemyFuseballTanker(surface, this.projectileManager, this.surfaceObjectsManager, this.rewardCallback, 10)
    // );
    // this.surfaceObjectsManager.addEnemy(new EnemyPulsar(surface, this.projectileManager, this.rewardCallback, 12));
    // this.surfaceObjectsManager.addEnemy(
    //   new EnemyPulsarTanker(surface, this.projectileManager, this.surfaceObjectsManager, this.rewardCallback, 14)
    // );
  }

  release () {
    this.unregisterKeys();
  }

  registerKeys () {
    keyboardInput.register('KeyA', () => {this.shooter.moveLeft();});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight();});
    keyboardInput.register('Space', () => {this.shooter.fire();});
    keyboardInput.register('KeyQ', () => {this.shooter.fireSuperzapper();});

    //Spawners
    keyboardInput.register('KeyF', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyFlipper(
          this.surface,
          this.projectileManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyS', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemySpiker(
          this.surface,
          this.projectileManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyB', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyFuseball(
          this.surface,
          this.projectileManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyP', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyPulsar(
          this.surface,
          this.projectileManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyT', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyFlipperTanker(
          this.surface,
          this.projectileManager,
          this.surfaceObjectsManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyY', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyFuseballTanker(
          this.surface,
          this.projectileManager,
          this.surfaceObjectsManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });

    keyboardInput.register('KeyU', () => {
      this.surfaceObjectsManager.addEnemy(
        new EnemyPulsarTanker(
          this.surface,
          this.projectileManager,
          this.surfaceObjectsManager,
          this.rewardCallback,
          randomRange(0, 15)
        )
      );
    });
  }

  unregisterKeys () {
    keyboardInput.unregister('KeyA');
    keyboardInput.unregister('KeyD');
    keyboardInput.unregister('Space');
    keyboardInput.unregister('KeyQ');
    keyboardInput.unregister('KeyF');
    keyboardInput.unregister('KeyS');
    keyboardInput.unregister('KeyB');
    keyboardInput.unregister('KeyP');
    keyboardInput.unregister('KeyT');
    keyboardInput.unregister('KeyY');
    keyboardInput.unregister('KeyU');
  }

  update () {
    this.projectileManager.update();
    this.surfaceObjectsManager.update();

    if (!this.shooter.alive) {
      this.shooterKilledCallback();
      this.shooter.alive = true;
    }
  }
}
