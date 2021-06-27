import readonly from '@/utils/readonly';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import EnemySpiker from '@/Object/Enemies/EnemySpiker';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';
import EnemyPulsar from '@/Object/Enemies/EnemyPulsar';
import EnemyFlipperTanker from '@/Object/Enemies/EnemyFlipperTanker';
import EnemyFuseballTanker from '@/Object/Enemies/EnemyFuseballTanker';
import EnemyPulsarTanker from '@/Object/Enemies/EnemyPulsarTanker';
import randomRange from '@/utils/randomRange';

export default class EnemySpawner {
  @readonly
  static SPAWN_MAP = [
    { type: Enemy.TYPE_FLIPPER, level: 1, chanceOfSpawning: 1 },
    { type: Enemy.TYPE_FLIPPER_TANKER, level: 3, chanceOfSpawning: 0.5 },
    { type: Enemy.TYPE_SPIKER, level: 4, chanceOfSpawning: 1 },
    { type: Enemy.TYPE_FUSEBALL, level: 11, chanceOfSpawning: 0.8 },
    { type: Enemy.TYPE_PULSAR, level: 17, chanceOfSpawning: 0.8 },
    { type: Enemy.TYPE_FUSEBALL_TANKER, level: 33, chanceOfSpawning: 0.5 },
    { type: Enemy.TYPE_PULSAR_TANKER, level: 41, chanceOfSpawning: 0.5 },
  ];

  @readonly
  static MIN_ENEMIES = 4;
  @readonly
  static MAX_ENEMIES = 16;
  @readonly
  static MAX_LEVEL = 99;

  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {ProjectileManager} */
  projectileManager;
  /** @var {function} */
  rewardCallback;

  /** @var {number} */
  currentLevel;
  /** @var {number} */
  scoreOnSurface;
  /** @var {number} */
  targetScore;

  /**
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {ProjectileManager} projectileManager
   * @param {Function} rewardCallback
   * @param {number} level
   * @param {number} levelInitScore
   * @param {number} targetScore
   */
  constructor (surfaceObjectsManager, projectileManager, rewardCallback, level, levelInitScore, targetScore) {
    this.surfaceObjectsManager = surfaceObjectsManager;
    this.projectileManager = projectileManager;
    this.rewardCallback = rewardCallback;

    this.currentLevel = level;
    this.scoreOnSurface = levelInitScore;
    this.targetScore = targetScore;
  }

  spawn () {
    if (this.scoreOnSurface >= this.targetScore) {
      return;
    }

    let amountOfAliveEnemiesOnSurface = this.surfaceObjectsManager.enemies.filter(enemy => enemy.alive).length;
    let amountOfEnemiesAllowedOnSurface = Math.round(
      Math.pow(this.currentLevel / EnemySpawner.MAX_LEVEL, 2)
      * (EnemySpawner.MAX_ENEMIES - EnemySpawner.MIN_ENEMIES)
      + EnemySpawner.MIN_ENEMIES
    );

    let spawnChance = 1 - (amountOfAliveEnemiesOnSurface / amountOfEnemiesAllowedOnSurface);

    if (spawnChance === 0 || Math.random() > spawnChance) {
      return;
    }

    let enemiesThatCanBeSpawned = EnemySpawner.SPAWN_MAP.filter(enemy => enemy.level <= this.currentLevel);
    let enemyToSpawn = this.drawEnemy(enemiesThatCanBeSpawned);
    let lane = randomRange(0, 15);

    /** @var {?Enemy} */
    let enemy;
    switch (enemyToSpawn.type) {
      case Enemy.TYPE_FLIPPER:
        enemy = this.spawnFlipper(lane);
        break;
      case Enemy.TYPE_FLIPPER_TANKER:
        enemy = this.spawnFlipperTanker(lane);
        break;
      case Enemy.TYPE_SPIKER:
        enemy = this.spawnSpiker(lane);
        break;
      case Enemy.TYPE_FUSEBALL:
        enemy = this.spawnFuseball(lane);
        break;
      case Enemy.TYPE_PULSAR:
        enemy = this.spawnPulsar(lane);
        break;
      case Enemy.TYPE_FUSEBALL_TANKER:
        enemy = this.spawnFuseballTanker(lane);
        break;
      case Enemy.TYPE_PULSAR_TANKER:
        enemy = this.spawnPulsarTanker(lane);
        break;
      default:
        throw new Error(`Trying to spawn unknown enemy: ${enemyToSpawn.type}`);
    }

    this.scoreOnSurface += enemy.valueInPoints;

    console.log(`Spawning ${enemyToSpawn.type} on lane ${lane}. Score on surface: ${this.scoreOnSurface}`);
  }

  /** @param {{level: number, type: string, chanceOfSpawning: number}[]} enemies */
  drawEnemy (enemies) {
    let range = enemies.reduce(((acc, val) => acc + val.chanceOfSpawning), 0);
    let draw = Math.random() * range;

    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].chanceOfSpawning >= draw) {
        return enemies[i];
      } else {
        draw -= enemies[i].chanceOfSpawning;
      }
    }

    throw new Error('Something weird happened.');
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnFlipper (lane, zPosition = 1) {
    /** @var {EnemyFlipper} */
    let flipper = this.surfaceObjectsManager.addEnemy(
      new EnemyFlipper(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.rewardCallback,
        lane,
        zPosition
      )
    );

    if (this.currentLevel === 1) {
      flipper.cannotFlip();
    }

    return flipper;
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnSpiker (lane, zPosition = 1) {
    return this.surfaceObjectsManager.addEnemy(
      new EnemySpiker(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.rewardCallback,
        lane,
        zPosition
      )
    );
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnFuseball (lane, zPosition = 1) {
    return this.surfaceObjectsManager.addEnemy(
      new EnemyFuseball(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.rewardCallback,
        lane,
        zPosition
      )
    );
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnPulsar (lane, zPosition = 1) {
    return this.surfaceObjectsManager.addEnemy(
      new EnemyPulsar(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.rewardCallback,
        lane,
        zPosition
      )
    );
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnFlipperTanker (lane, zPosition = 1) {
    return this.surfaceObjectsManager.addEnemy(
      new EnemyFlipperTanker(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.spawnFlipper.bind(this),
        this.rewardCallback,
        lane,
        zPosition
      )
    );
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnFuseballTanker (lane, zPosition = 1) {
    return this.surfaceObjectsManager.addEnemy(
      new EnemyFuseballTanker(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.spawnFuseball.bind(this),
        this.rewardCallback,
        lane,
        zPosition
      )
    );
  }

  /**
   * @param {number} lane
   * @param {number} zPosition
   */
  spawnPulsarTanker (lane, zPosition = 1) {
    return this.surfaceObjectsManager.addEnemy(
      new EnemyPulsarTanker(
        this.surfaceObjectsManager.surface,
        this.projectileManager,
        this.spawnPulsar.bind(this),
        this.rewardCallback,
        lane,
        zPosition
      )
    );
  }
}
