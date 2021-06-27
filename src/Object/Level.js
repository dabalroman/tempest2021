import Shooter from '@/Object/Shooters/Shooter';
import SurfaceObjectsManager from '@/Object/Manager/SurfaceObjectsManager';
import ProjectileManager from '@/Object/Manager/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';
import randomRange from '@/utils/randomRange';
import EnemySpawner from '@/Object/Enemies/EnemySpawner';

export default class Level {
  /** @var {Surface} */
  surface;
  /** @var {Shooter} */
  shooter;
  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {ProjectileManager} */
  projectileManager;
  /** @var {EnemySpawner} */
  enemySpawner;

  /** @var {number} */
  currentLevel;
  /** @var {number} */
  levelInitScore;
  /** @var {number} */
  targetScore;

  /** @var {function} */
  rewardCallback;
  /** @var {function} */
  levelWonCallback;
  /** @var {function} */
  shooterKilledCallback;
  /** @var {function} */
  getCurrentScore;

  /**
   * @param {Surface} surface
   * @param {number} currentLevel
   * @param {number} levelInitScore
   * @param {number} targetScore
   * @param {function} rewardCallback
   * @param {function} levelWonCallback
   * @param {function} shooterKilledCallback
   * @param {function} getCurrentScore
   */
  constructor (
    surface,
    currentLevel,
    levelInitScore,
    targetScore,
    rewardCallback,
    levelWonCallback,
    shooterKilledCallback,
    getCurrentScore
  ) {
    this.surface = surface;

    this.currentLevel = currentLevel;
    this.levelInitScore = levelInitScore;
    this.targetScore = targetScore;

    this.rewardCallback = rewardCallback;
    this.levelWonCallback = levelWonCallback;
    this.shooterKilledCallback = shooterKilledCallback;
    this.getCurrentScore = getCurrentScore;

    this.surfaceObjectsManager = new SurfaceObjectsManager(surface);
    this.projectileManager = new ProjectileManager(this.surfaceObjectsManager);
    this.enemySpawner = new EnemySpawner(
      this.surfaceObjectsManager,
      this.projectileManager,
      this.rewardCallback,
      this.currentLevel,
      this.levelInitScore,
      this.targetScore
    );

    console.log(this.currentLevel, this.levelInitScore, this.targetScore);

    this.shooter = new Shooter(
      surface,
      this.projectileManager,
      this.surfaceObjectsManager,
      this.shooterKilled.bind(this),
      7
    );

    this.surfaceObjectsManager.addShooter(this.shooter);
  }

  release () {
    this.surfaceObjectsManager.removeEnemies();
    this.surfaceObjectsManager.removeShooters();
    this.surfaceObjectsManager.removeSpikes();
    this.surfaceObjectsManager = undefined;

    this.projectileManager.removeProjectiles();
    this.projectileManager = undefined;

    this.surface = undefined;
    this.shooter = undefined;

    this.unregisterKeys();
  }

  registerKeys () {
    keyboardInput.register('KeyA', () => {this.shooter.moveLeft();});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight();});
    keyboardInput.register('Space', () => {this.shooter.fire();});
    keyboardInput.register('KeyQ', () => {this.shooter.fireSuperzapper();});

    //Spawners
    keyboardInput.register('KeyF', () => {
      this.enemySpawner.spawnFlipper(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyS', () => {
      this.enemySpawner.spawnSpiker(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyB', () => {
      this.enemySpawner.spawnFuseball(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyP', () => {
      this.enemySpawner.spawnPulsar(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyT', () => {
      this.enemySpawner.spawnFlipperTanker(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyY', () => {
      this.enemySpawner.spawnFuseballTanker(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyU', () => {
      this.enemySpawner.spawnPulsarTanker(randomRange(0, 15), 0.5);
    });

    keyboardInput.register('KeyZ', () => {
      this.surfaceObjectsManager.removeEnemies();
    });

    keyboardInput.register('KeyE', () => { this.levelWonCallback(); });
    keyboardInput.register('KeyR', () => { this.shooter.renovate(); });
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
    keyboardInput.unregister('KeyZ');
    keyboardInput.unregister('KeyE');
    keyboardInput.unregister('KeyR');
  }

  update () {
    this.projectileManager.update();
    this.surfaceObjectsManager.update();

    if (this.shooter.inState(Shooter.STATE_ALIVE)) {
      this.enemySpawner.spawn();
    }

    if (this.enemySpawner.reachedScoreTarget() && this.surfaceObjectsManager.getAmountOfAliveEnemies() === 0) {
      this.levelWonCallback();
    }
  }

  shooterKilled () {
    this.surfaceObjectsManager.removeEnemies();

    if (this.shooterKilledCallback()) {
      this.shooter.renovate();
      this.enemySpawner.setScore(this.getCurrentScore());
    }
  }
}
