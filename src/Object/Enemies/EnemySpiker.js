import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import State from '@/Object/State';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import randomRange from '@/utils/randomRange';

export default class EnemySpiker extends Enemy {
  @readonly
  static TURNAROUND_HEIGHT = 0.1;

  @readonly
  static STATE_IDLE = new State(100, 1, 'idle');
  @readonly
  static STATE_SHOOTING = new State(200, 0.05, 'shooting');
  @readonly
  static STATE_DISAPPEARING = new State(1000, 1, 'disappearing');
  @readonly
  static STATE_EXPLODING = new State(1000, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_REACHED_TOP = 0x1;
  @readonly
  static FLAG_SHOOTS_FIRED = 0x2;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} rewardCallback
   * @param {number} laneId
   * @param {number} zPosition
   */
  constructor (surface, projectileManager, rewardCallback, laneId = 0, zPosition = 1) {
    super(surface, projectileManager, rewardCallback, laneId, zPosition, SurfaceObject.TYPE_SPIKER);

    this.firstLevel = 4;
    this.valueInPoints = 150;

    this.zSpeed = -randomRange(3, 6) * 0.001;
    this.setState(EnemySpiker.STATE_IDLE);
  }

  updateState () {
    if (this.inState(EnemySpiker.STATE_IDLE)) {
      this.setState(
        State.drawNextState(
          EnemySpiker.STATE_IDLE,
          EnemySpiker.STATE_SHOOTING
        )
      );

    } else if (this.inState(EnemySpiker.STATE_SHOOTING)) {
      this.setState(EnemySpiker.STATE_IDLE);
      this.unsetFlag(EnemySpiker.FLAG_SHOOTS_FIRED);

    } else if (this.inState(EnemySpiker.STATE_EXPLODING)) {
      this.setState(EnemySpiker.STATE_DEAD);

    } else if (this.inState(EnemySpiker.STATE_DISAPPEARING)) {
      this.setState(EnemySpiker.STATE_DEAD);
    }
  }

  updateEntity () {
    if (this.inState(EnemySpiker.STATE_DEAD)) {
      this.alive = false;
    }

    if (this.zPosition <= EnemySpiker.TURNAROUND_HEIGHT && this.isFlagNotSet(EnemySpiker.FLAG_REACHED_TOP)) {
      this.setFlag(EnemySpiker.FLAG_REACHED_TOP);
      this.zPosition = EnemySpiker.TURNAROUND_HEIGHT;
    }

    if (this.zPosition >= 1 && this.isFlagSet(EnemySpiker.FLAG_REACHED_TOP)) {
      this.alive = false;
    }

    if (this.inState(EnemySpiker.STATE_SHOOTING) && this.isFlagNotSet(EnemySpiker.FLAG_SHOOTS_FIRED)) {
      this.setFlag(EnemySpiker.FLAG_SHOOTS_FIRED);
      this.fire();
    }

    if (!this.inState(EnemySpiker.STATE_EXPLODING)) {
      if (this.isFlagNotSet(EnemySpiker.FLAG_REACHED_TOP)) {
        this.zPosition += this.zSpeed;
      } else {
        this.zPosition -= this.zSpeed;
      }
    }
  }

  disappear () {
    if (this.inState(EnemySpiker.STATE_EXPLODING) || this.inState(EnemySpiker.STATE_DEAD)) {
      return;
    }

    this.setState(EnemySpiker.STATE_DISAPPEARING);
    super.die();
  }

  die () {
    if (this.inState(EnemySpiker.STATE_DEAD)) {
      return;
    }

    this.setState(EnemySpiker.STATE_EXPLODING);
    super.die();
  }
}
