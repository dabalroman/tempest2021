import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import State from '@/Object/Enemies/State';
import randomRange from '@/utils/randomRange';

export default class EnemyTanker extends Enemy {
  @readonly
  static STATE_IDLE = new State(100, 1, 'idle');
  @readonly
  static STATE_SHOOTING = new State(100, 0.15, 'shooting');
  @readonly
  static STATE_EXPLODING = new State(1000, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_SHOOTS_FIRED = 0x1;

  /** {SurfaceObjectsManager} */
  surfaceObjectsManager;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {function} rewardCallback
   * @param {string} type
   * @param {number} laneId
   */
  constructor (
    surface,
    projectileManager,
    surfaceObjectsManager,
    rewardCallback,
    type,
    laneId = 0
  ) {
    super(surface, projectileManager, rewardCallback, laneId, type);

    this.surfaceObjectsManager = surfaceObjectsManager;

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

    if (!this.inState(EnemyTanker.STATE_EXPLODING)) {
      this.zPosition += this.zSpeed;
    }
  }

  hitByProjectile () {
    this.die();
    this.createEnemies();
  }

  die () {
    this.setState(EnemyTanker.STATE_EXPLODING);
    super.die();
  }

  createEnemies () {
    throw new Error('Method \'createEnemies()\' must be implemented.');
  }
}
