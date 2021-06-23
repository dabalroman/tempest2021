import Enemy from '@/Object/Enemies/Enemy';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import randomRange from '@/utils/randomRange';
import readonly from '@/utils/readonly';
import State from '@/Object/Enemies/State';

export default class EnemyFuseball extends Enemy {
  @readonly
  static MIN_Z_POSITION = 0.1;
  @readonly
  static MAX_Z_POSITION = 0.9;
  @readonly
  static MIN_AMOUNT_OF_LANE_CHANGES_UNTIL_TOP = 2;
  @readonly
  static MAX_AMOUNT_OF_LANE_CHANGES_UNTIL_TOP = 10;

  @readonly
  static STATE_MOVING_ALONG_LINE = new State(1500, 1, 'moving_along_line');
  @readonly
  static STATE_SWITCHING_LANE = new State(2000, 1, 'switching_lane');
  @readonly
  static STATE_EXPLODING = new State(1000, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_REACHED_TOP = 0x1;
  @readonly
  static FLAG_LANE_CHANGED = 0x2;
  @readonly
  static FLAG_SWITCHING_LANE_CW = 0x4;
  @readonly
  static FLAG_SWITCHING_LANE_CCW = 0x8;
  @readonly
  static FLAG_SET_LANE_CW = 0x10;
  @readonly
  static FLAG_SET_LANE_CCW = 0x20;
  @readonly
  static FLAG_SWITCHING_DIR_CHOSEN = 0x40;
  @readonly
  static FLAG_MOVING_TARGET_CHOSEN = 0x80;
  @readonly
  static FLAG_IMMUNE = 0x100;
  @readonly
  static FLAG_REACHED_SHOOTER = 0x200;

  /** {number} */
  zBase = 0;
  /** {number} */
  zTarget = 0;

  /** {number} */
  laneChanges = 0;
  /** {number} */
  lastLaneSwitchingProgress = 0;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} rewardCallback
   * @param {number} laneId
   */
  constructor (surface, projectileManager, rewardCallback, laneId = 0) {
    super(surface, projectileManager, rewardCallback, laneId, SurfaceObject.TYPE_FUSEBALL);

    this.firstLevel = 11;
    this.valueInPoints = 250;

    this.setState(EnemyFuseball.STATE_MOVING_ALONG_LINE);
    this.setFlag(EnemyFuseball.FLAG_IMMUNE);
  }

  updateState () {
    if (this.inState(EnemyFuseball.STATE_MOVING_ALONG_LINE)) {
      this.setState(EnemyFuseball.STATE_SWITCHING_LANE);

      this.unsetFlag(EnemyFuseball.FLAG_IMMUNE);
      this.unsetFlag(EnemyFuseball.FLAG_MOVING_TARGET_CHOSEN);

    } else if (this.inState(EnemyFuseball.STATE_SWITCHING_LANE)) {
      if (this.isFlagSet(EnemyFuseball.FLAG_REACHED_TOP)) {
        this.setState(EnemyFuseball.STATE_SWITCHING_LANE);
      } else {
        this.setState(EnemyFuseball.STATE_MOVING_ALONG_LINE);
      }

      if (this.isFlagSet(EnemyFuseball.FLAG_SWITCHING_LANE_CW)) {
        this.setFlag(EnemyFuseball.FLAG_SET_LANE_CW);
      }

      this.setFlag(EnemyFuseball.FLAG_IMMUNE);
      this.unsetFlag(EnemyFuseball.FLAG_SWITCHING_DIR_CHOSEN);
      this.unsetFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CCW);
      this.unsetFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CW);
      this.unsetFlag(EnemyFuseball.FLAG_LANE_CHANGED);

    } else if (this.inState(EnemyFuseball.STATE_EXPLODING)) {
      this.setState(EnemyFuseball.STATE_DEAD);
    }
  }

  updateEntity () {
    if (this.inState(EnemyFuseball.STATE_DEAD)) {
      this.alive = false;
    }

    if (!this.inState(EnemyFuseball.STATE_EXPLODING)) {
      this.hittable = !this.isFlagSet(EnemyFuseball.FLAG_IMMUNE);
    }

    if (
      this.inState(EnemyFuseball.STATE_SWITCHING_LANE)
      && this.isFlagNotSet(EnemyFuseball.FLAG_SWITCHING_DIR_CHOSEN)
    ) {
      this.setFlag(EnemyFuseball.FLAG_SWITCHING_DIR_CHOSEN);

      if (this.isFlagSet(EnemyFuseball.FLAG_REACHED_TOP)) {
        let direction = this.surface.getShortestPathDirection(this.laneId, this.surface.activeLaneId);

        if (direction === -1) {
          this.setFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CCW);
          this.setFlag(EnemyFuseball.FLAG_SET_LANE_CCW);
          this.unsetFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CW);
          this.unsetFlag(EnemyFuseball.FLAG_REACHED_SHOOTER);
        } else if (direction === 1) {
          this.setFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CW);
          this.setFlag(EnemyFuseball.FLAG_SET_LANE_CW);
          this.unsetFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CCW);
          this.unsetFlag(EnemyFuseball.FLAG_REACHED_SHOOTER);
        } else {
          this.setFlag(EnemyFuseball.FLAG_REACHED_SHOOTER);
        }
      } else {
        if (
          this.isFlagNotSet(EnemyFuseball.FLAG_SWITCHING_LANE_CW)
          && this.isFlagNotSet(EnemyFuseball.FLAG_SWITCHING_LANE_CCW)
        ) {
          let canSwitchCCW = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1) !== this.laneId;
          let canSwitchCW = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1) !== this.laneId;

          if (canSwitchCCW && canSwitchCW) {
            if (Math.random() > 0.5) {
              this.setFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CW);
            } else {
              this.setFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CCW);
              this.setFlag(EnemyFuseball.FLAG_SET_LANE_CCW);
            }
          } else if (canSwitchCW) {
            this.setFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CW);
          } else {
            this.setFlag(EnemyFuseball.FLAG_SWITCHING_LANE_CCW);
            this.setFlag(EnemyFuseball.FLAG_SET_LANE_CCW);
          }
        }
      }
    }

    if (this.inState(EnemyFuseball.STATE_SWITCHING_LANE) && this.isFlagNotSet(EnemyFuseball.FLAG_LANE_CHANGED)) {
      this.setFlag(EnemyFuseball.FLAG_LANE_CHANGED);
      this.laneChanges++;
    }

    if (this.isFlagSet(EnemyFuseball.FLAG_SET_LANE_CW) || this.isFlagSet(EnemyFuseball.FLAG_SET_LANE_CCW)) {
      let direction = this.isFlagSet(EnemyFuseball.FLAG_SET_LANE_CW) ? 1 : -1;

      this.setLane(this.laneId + direction);

      this.unsetFlag(EnemyFuseball.FLAG_SET_LANE_CW);
      this.unsetFlag(EnemyFuseball.FLAG_SET_LANE_CCW);
    }

    if (
      this.inState(EnemyFuseball.STATE_MOVING_ALONG_LINE)
      && this.isFlagNotSet(EnemyFuseball.FLAG_MOVING_TARGET_CHOSEN)
      && this.isFlagNotSet(EnemyFuseball.FLAG_REACHED_TOP)
    ) {
      this.setFlag(EnemyFuseball.FLAG_MOVING_TARGET_CHOSEN);
      this.zBase = this.zPosition;
      this.zTarget = randomRange(EnemyFuseball.MIN_Z_POSITION * 10, EnemyFuseball.MAX_Z_POSITION * 10) / 10;

      if (this.laneChanges >= EnemyFuseball.MIN_AMOUNT_OF_LANE_CHANGES_UNTIL_TOP) {
        let x = (this.laneChanges - EnemyFuseball.MIN_AMOUNT_OF_LANE_CHANGES_UNTIL_TOP)
          / EnemyFuseball.MAX_AMOUNT_OF_LANE_CHANGES_UNTIL_TOP;

        if (Math.random() < x * x) {
          this.zTarget = 0;
        }
      }
    }

    if (this.inState(EnemyFuseball.STATE_SWITCHING_LANE)) {
      this.zPosition = this.zTarget;
      this.lastLaneSwitchingProgress = this.stateProgressInTime();

      if (this.zPosition === 0) {
        this.setFlag(EnemyFuseball.FLAG_REACHED_TOP);
      }
    }

    if (this.inState(EnemyFuseball.STATE_MOVING_ALONG_LINE)) {
      this.zPosition = this.zBase + (this.zTarget - this.zBase) * this.stateProgressInTime();
    }
  }

  immuneDuringNextLaneSwitch () {
    this.setFlag(EnemyFuseball.FLAG_IMMUNE);
    this.hittable = false;
  }

  die () {
    this.setState(EnemyFuseball.STATE_EXPLODING);
    super.die();
  }
}
