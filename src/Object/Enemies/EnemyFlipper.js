import Enemy from '@/Object/Enemies/Enemy';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import randomRange from '@/utils/randomRange';
import readonly from '@/utils/readonly';
import State from '@/Object/State';

export default class EnemyFlipper extends Enemy {
  @readonly
  static STATE_IDLE = new State(100, 1, 'idle');
  @readonly
  static STATE_ROTATING_BEGIN = new State(175, 0.2, 'rotate_begin');
  @readonly
  static STATE_ROTATING_END = new State(175, 1, 'rotate_end');
  @readonly
  static STATE_SHOOTING = new State(100, 0.1, 'shooting');
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
  @readonly
  static FLAG_LANE_CHANGED = 0x4;
  @readonly
  static FLAG_ROTATION_CW = 0x8;
  @readonly
  static FLAG_ROTATION_CCW = 0x10;
  @readonly
  static FLAG_ROTATION_DIR_CHOSEN = 0x20;
  @readonly
  static FLAG_IMMUNE_ROTATION = 0x40;
  @readonly
  static FLAG_REACHED_SHOOTER = 0x80;
  @readonly
  static FLAG_CANNOT_FLIP = 0x100;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} rewardCallback
   * @param {number} laneId
   * @param {number} zPosition
   */
  constructor (surface, projectileManager, rewardCallback, laneId = 0, zPosition = 1) {
    super(surface, projectileManager, rewardCallback, laneId, zPosition, SurfaceObject.TYPE_FLIPPER);

    this.firstLevel = 1;
    this.valueInPoints = 150;

    this.zSpeed = -randomRange(6, 9) * 0.001;
    this.setState(EnemyFlipper.STATE_IDLE);
  }

  updateState () {
    if (this.inState(EnemyFlipper.STATE_IDLE)) {
      if (this.isFlagSet(EnemyFlipper.FLAG_REACHED_TOP)) {
        this.setState(EnemyFlipper.STATE_ROTATING_BEGIN);

      } else {
        this.setState(
          State.drawNextState(
            EnemyFlipper.STATE_IDLE,
            EnemyFlipper.STATE_SHOOTING,
            this.isFlagNotSet(EnemyFlipper.FLAG_CANNOT_FLIP)
              ? EnemyFlipper.STATE_ROTATING_BEGIN
              : EnemyFlipper.STATE_IDLE
          )
        );
      }

    } else if (this.inState(EnemyFlipper.STATE_ROTATING_BEGIN)) {
      this.setState(EnemyFlipper.STATE_ROTATING_END);

      if (this.isFlagSet(EnemyFlipper.FLAG_IMMUNE_ROTATION)) {
        this.unsetFlag(EnemyFlipper.FLAG_IMMUNE_ROTATION);
        this.hittable = true;
      }

    } else if (this.inState(EnemyFlipper.STATE_ROTATING_END)) {
      if (this.isFlagSet(EnemyFlipper.FLAG_REACHED_TOP)) {
        this.setState(EnemyFlipper.STATE_ROTATING_BEGIN);
      } else {
        this.setState(EnemyFlipper.STATE_IDLE);
      }
      this.unsetFlag(EnemyFlipper.FLAG_LANE_CHANGED);
      this.unsetFlag(EnemyFlipper.FLAG_ROTATION_CW);
      this.unsetFlag(EnemyFlipper.FLAG_ROTATION_CCW);
      this.unsetFlag(EnemyFlipper.FLAG_ROTATION_DIR_CHOSEN);

    } else if (this.inState(EnemyFlipper.STATE_SHOOTING)) {
      this.setState(EnemyFlipper.STATE_IDLE);
      this.unsetFlag(EnemyFlipper.FLAG_SHOOTS_FIRED);

    } else if (this.inState(EnemyFlipper.STATE_EXPLODING)) {
      this.setState(EnemyFlipper.STATE_DEAD);

    } else if (this.inState(EnemyFlipper.STATE_DISAPPEARING)) {
      this.setState(EnemyFlipper.STATE_DEAD);
    }
  }

  updateEntity () {
    if (this.inState(EnemyFlipper.STATE_DEAD)) {
      this.alive = false;
    }

    if (this.zPosition <= 0 && this.isFlagNotSet(EnemyFlipper.FLAG_REACHED_TOP)) {
      this.setFlag(EnemyFlipper.FLAG_REACHED_TOP);
      this.zPosition = 0;
    }

    if (this.inState(EnemyFlipper.STATE_ROTATING_BEGIN) && this.isFlagNotSet(EnemyFlipper.FLAG_ROTATION_DIR_CHOSEN)) {
      this.setFlag(EnemyFlipper.FLAG_ROTATION_DIR_CHOSEN);

      if (this.isFlagSet(EnemyFlipper.FLAG_REACHED_TOP)) {
        let direction = this.surface.getShortestPathDirection(this.laneId, this.surface.activeLaneId);

        if (direction === 1) {
          this.setFlag(EnemyFlipper.FLAG_ROTATION_CCW);
          this.unsetFlag(EnemyFlipper.FLAG_ROTATION_CW);
          this.unsetFlag(EnemyFlipper.FLAG_REACHED_SHOOTER);
        } else if (direction === -1) {
          this.setFlag(EnemyFlipper.FLAG_ROTATION_CW);
          this.unsetFlag(EnemyFlipper.FLAG_ROTATION_CCW);
          this.unsetFlag(EnemyFlipper.FLAG_REACHED_SHOOTER);
        } else {
          this.setFlag(EnemyFlipper.FLAG_REACHED_SHOOTER);
        }
      } else {
        if (this.isFlagNotSet(EnemyFlipper.FLAG_ROTATION_CW) && this.isFlagNotSet(EnemyFlipper.FLAG_ROTATION_CCW)) {
          let canRotateCCW = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1) !== this.laneId;
          let canRotateCW = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1) !== this.laneId;

          if (canRotateCCW && canRotateCW) {
            this.setFlag(Math.random() > 0.5 ? EnemyFlipper.FLAG_ROTATION_CW : EnemyFlipper.FLAG_ROTATION_CCW);
          } else if (canRotateCW) {
            this.setFlag(EnemyFlipper.FLAG_ROTATION_CW);
          } else {
            this.setFlag(EnemyFlipper.FLAG_ROTATION_CCW);
          }
        }
      }
    }

    if (this.inState(EnemyFlipper.STATE_ROTATING_END) && this.isFlagNotSet(EnemyFlipper.FLAG_LANE_CHANGED)) {
      this.setFlag(EnemyFlipper.FLAG_LANE_CHANGED);

      if (this.isFlagSet(EnemyFlipper.FLAG_ROTATION_CW) || this.isFlagSet(EnemyFlipper.FLAG_ROTATION_CCW)) {
        let direction = this.isFlagSet(EnemyFlipper.FLAG_ROTATION_CCW) ? 1 : -1;
        this.setLane(this.laneId + direction);
      }
    }

    if (this.inState(EnemyFlipper.STATE_SHOOTING) && this.isFlagNotSet(EnemyFlipper.FLAG_SHOOTS_FIRED)) {
      this.setFlag(EnemyFlipper.FLAG_SHOOTS_FIRED);
      this.fire();
    }

    if (this.isFlagNotSet(EnemyFlipper.FLAG_REACHED_TOP) && !this.inState(EnemyFlipper.STATE_EXPLODING)) {
      this.zPosition += this.zSpeed;
    }
  }

  cannotFlip () {
    this.setFlag(EnemyFlipper.FLAG_CANNOT_FLIP);
  }

  immuneDuringNextRotation () {
    this.setFlag(EnemyFlipper.FLAG_IMMUNE_ROTATION);
    this.hittable = false;
  }

  disappear () {
    if (this.inState(EnemyFlipper.STATE_EXPLODING) || this.inState(EnemyFlipper.STATE_DEAD)) {
      return;
    }

    this.setState(EnemyFlipper.STATE_DISAPPEARING);
    super.die();
  }

  die () {
    if (this.inState(EnemyFlipper.STATE_DEAD)) {
      return;
    }

    this.setState(EnemyFlipper.STATE_EXPLODING);
    super.die();
  }
}
