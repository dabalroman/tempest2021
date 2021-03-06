import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import State from '@/Object/State';
import randomRange from '@/utils/randomRange';

export default class EnemyTanker extends Enemy {
  @readonly
  static STATE_IDLE = new State(100, 1, 'idle');
  @readonly
  static STATE_SHOOTING = new State(100, 0.1, 'shooting');
  @readonly
  static STATE_DISAPPEARING = new State(1000, 1, 'disappearing');
  @readonly
  static STATE_EXPLODING = new State(1000, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_SHOOTS_FIRED = 0x1;

  /** {function} */
  enemySpawnFunction;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} enemySpawnFunction
   * @param {function} rewardCallback
   * @param {string} type
   * @param {number} laneId
   * @param {number} zPosition
   */
  constructor (
    surface,
    projectileManager,
    enemySpawnFunction,
    rewardCallback,
    type,
    laneId = 0,
    zPosition = 1
  ) {
    super(surface, projectileManager, rewardCallback, laneId, zPosition, type);

    this.enemySpawnFunction = enemySpawnFunction;

    this.firstLevel = 3;
    this.valueInPoints = 100;

    this.zSpeed = -randomRange(3, 6) * 0.001;
    this.setState(EnemyTanker.STATE_IDLE);
  }

  updateState () {
    if (this.inState(EnemyTanker.STATE_IDLE)) {
      this.setState(
        State.drawNextState(
          EnemyTanker.STATE_IDLE,
          EnemyTanker.STATE_SHOOTING
        )
      );

    } else if (this.inState(EnemyTanker.STATE_SHOOTING)) {
      this.setState(EnemyTanker.STATE_IDLE);
      this.unsetFlag(EnemyTanker.FLAG_SHOOTS_FIRED);

    } else if (this.inState(EnemyTanker.STATE_EXPLODING)) {
      this.setState(EnemyTanker.STATE_DEAD);

    } else if (this.inState(EnemyTanker.STATE_DISAPPEARING)) {
      this.setState(EnemyTanker.STATE_DEAD);
    }
  }

  updateEntity () {
    if (this.inState(EnemyTanker.STATE_DEAD)) {
      this.alive = false;
    }

    if (this.zPosition <= 0) {
      this.alive = false;
      this.createEnemies();
    }

    if (this.inState(EnemyTanker.STATE_SHOOTING) && this.isFlagNotSet(EnemyTanker.FLAG_SHOOTS_FIRED)) {
      this.setFlag(EnemyTanker.FLAG_SHOOTS_FIRED);
      this.fire();
    }

    if (!this.inState(EnemyTanker.STATE_EXPLODING) && !this.inState(EnemyTanker.STATE_DISAPPEARING)) {
      this.zPosition += this.zSpeed;
    }
  }

  hitByProjectile () {
    this.reward = true;
    this.die();
    this.createEnemies();
  }

  disappear () {
    if (this.inState(EnemyTanker.STATE_EXPLODING) || this.inState(EnemyTanker.STATE_DEAD)) {
      return;
    }

    this.setState(EnemyTanker.STATE_DISAPPEARING);
    super.die();
  }

  die () {
    if (this.inState(EnemyTanker.STATE_DEAD)) {
      return;
    }

    this.setState(EnemyTanker.STATE_EXPLODING);
    super.die();
  }

  createEnemies () {
    throw new Error('Method \'createEnemies()\' must be implemented.');
  }
}
