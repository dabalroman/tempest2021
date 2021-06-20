import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import State from '@/Object/Enemies/State';

export default class EnemySpiker extends Enemy {
  @readonly
  static MAX_HEIGHT = 0.1;

  @readonly
  static STATE_IDLE = new State(100, 1, 'idle');
  @readonly
  static STATE_SHOOTING = new State(100, 0.4, 'shooting');
  @readonly
  static STATE_EXPLODING = new State(500, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_REACHED_TOP = 0x1;
  @readonly
  static FLAG_SHOOTS_FIRED = 0x2;

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
    }
  }

  updateEntity () {
    if (this.inState(EnemySpiker.STATE_DEAD)) {
      this.alive = false;
    }

    if (this.zPosition <= EnemySpiker.MAX_HEIGHT && this.isFlagNotSet(EnemySpiker.FLAG_REACHED_TOP)) {
      this.setFlag(EnemySpiker.FLAG_REACHED_TOP);
      this.zPosition = EnemySpiker.MAX_HEIGHT;
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

  hitByProjectile () {
    this.setState(EnemySpiker.STATE_EXPLODING);
    this.clearFlags();
  }
}
