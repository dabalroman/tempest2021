import Enemy from '@/Object/Enemies/Enemy';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import randomRange from '@/utils/randomRange';
import readonly from '@/utils/readonly';
import State from '@/Object/Enemies/State';

export default class EnemyPulsar extends Enemy {
  @readonly
  static MIN_Z_POSITION = 0.1;
  @readonly
  static MAX_Z_POSITION = 0.9;

  @readonly
  static STATE_MOVING_ALONG_LINE = new State(1500, 0.8, 'moving_along_line');
  @readonly
  static STATE_ROTATING_BEGIN = new State(200, 1, 'rotate_begin');
  @readonly
  static STATE_ROTATING_END = new State(200, 1, 'rotate_end');
  @readonly
  static STATE_WARNING = new State(1000, 1, 'warning');
  @readonly
  static STATE_PULSATING = new State(2000, 1, 'pulsating');
  @readonly
  static STATE_EXPLODING = new State(500, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_LANE_CHANGED = 0x1;
  @readonly
  static FLAG_ROTATION_CW = 0x2;
  @readonly
  static FLAG_ROTATION_CCW = 0x4;
  @readonly
  static FLAG_ROTATION_DIR_CHOSEN = 0x8;
  @readonly
  static FLAG_IMMUNE_ROTATION = 0x10;
  @readonly
  static FLAG_MOVING_TARGET_CHOSEN = 0x20;
  @readonly
  static FLAG_NO_WARNING = 0x40;

  /** {number} */
  zBase = 0;
  /** {number} */
  zTarget = 0;

  /** {number} */
  rendererHelperLaneChangesAmount = 0;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, laneId = 0) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_PULSAR);

    this.firstLevel = 1;
    this.setState(EnemyPulsar.STATE_MOVING_ALONG_LINE);
  }

  updateState () {
    if (this.inState(EnemyPulsar.STATE_MOVING_ALONG_LINE)) {
      this.setState(
        State.drawNextState(
          EnemyPulsar.STATE_MOVING_ALONG_LINE,
          EnemyPulsar.STATE_ROTATING_BEGIN,
          this.isFlagSet(EnemyPulsar.FLAG_NO_WARNING) ? EnemyPulsar.STATE_PULSATING : EnemyPulsar.STATE_WARNING,
        )
      );

      this.unsetFlag(EnemyPulsar.FLAG_MOVING_TARGET_CHOSEN);

    } else if (this.inState(EnemyPulsar.STATE_WARNING)) {
      this.setState(EnemyPulsar.STATE_PULSATING);

      this.surface.shortLane(this.laneId);

    } else if (this.inState(EnemyPulsar.STATE_PULSATING)) {
      this.setState(
        State.drawNextState(
          EnemyPulsar.STATE_MOVING_ALONG_LINE,
          EnemyPulsar.STATE_ROTATING_BEGIN,
          this.isFlagSet(EnemyPulsar.FLAG_NO_WARNING) ? EnemyPulsar.STATE_PULSATING : EnemyPulsar.STATE_WARNING,
        )
      );

      this.surface.unshortLane(this.laneId, false);

    } else if (this.inState(EnemyPulsar.STATE_ROTATING_BEGIN)) {
      this.setState(EnemyPulsar.STATE_ROTATING_END);

      if (this.isFlagSet(EnemyPulsar.FLAG_IMMUNE_ROTATION)) {
        this.unsetFlag(EnemyPulsar.FLAG_IMMUNE_ROTATION);
        this.hittable = true;
      }

    } else if (this.inState(EnemyPulsar.STATE_ROTATING_END)) {
      this.setState(EnemyPulsar.STATE_MOVING_ALONG_LINE);

      this.unsetFlag(EnemyPulsar.FLAG_LANE_CHANGED);
      this.unsetFlag(EnemyPulsar.FLAG_ROTATION_CW);
      this.unsetFlag(EnemyPulsar.FLAG_ROTATION_CCW);
      this.unsetFlag(EnemyPulsar.FLAG_ROTATION_DIR_CHOSEN);

      this.rendererHelperLaneChangesAmount++;

    } else if (this.inState(EnemyPulsar.STATE_EXPLODING)) {
      this.setState(EnemyPulsar.STATE_DEAD);
    }
  }

  updateEntity () {
    if (this.inState(EnemyPulsar.STATE_DEAD)) {
      this.alive = false;
    }

    if (this.inState(EnemyPulsar.STATE_ROTATING_BEGIN) && this.isFlagNotSet(EnemyPulsar.FLAG_ROTATION_DIR_CHOSEN)) {
      this.setFlag(EnemyPulsar.FLAG_ROTATION_DIR_CHOSEN);

      if (this.isFlagSet(EnemyPulsar.FLAG_REACHED_TOP)) {
        let direction = this.surface.getShortestPathDirection(this.laneId, this.surface.activeLaneId);

        if (direction === 1) {
          this.setFlag(EnemyPulsar.FLAG_ROTATION_CCW);
          this.unsetFlag(EnemyPulsar.FLAG_ROTATION_CW);
        } else if (direction === -1) {
          this.setFlag(EnemyPulsar.FLAG_ROTATION_CW);
          this.unsetFlag(EnemyPulsar.FLAG_ROTATION_CCW);
        }
      } else {
        if (this.isFlagNotSet(EnemyPulsar.FLAG_ROTATION_CW) && this.isFlagNotSet(EnemyPulsar.FLAG_ROTATION_CCW)) {
          let canRotateCCW = this.surface.getActualLaneIdFromProjectedMovement(this.laneId + 1) !== this.laneId;
          let canRotateCW = this.surface.getActualLaneIdFromProjectedMovement(this.laneId - 1) !== this.laneId;

          if (canRotateCCW && canRotateCW) {
            this.setFlag(Math.random() > 0.5 ? EnemyPulsar.FLAG_ROTATION_CW : EnemyPulsar.FLAG_ROTATION_CCW);
          } else if (canRotateCW) {
            this.setFlag(EnemyPulsar.FLAG_ROTATION_CW);
          } else {
            this.setFlag(EnemyPulsar.FLAG_ROTATION_CCW);
          }
        }
      }
    }

    if (this.inState(EnemyPulsar.STATE_ROTATING_END) && this.isFlagNotSet(EnemyPulsar.FLAG_LANE_CHANGED)) {
      this.setFlag(EnemyPulsar.FLAG_LANE_CHANGED);

      if (this.isFlagSet(EnemyPulsar.FLAG_ROTATION_CW) || this.isFlagSet(EnemyPulsar.FLAG_ROTATION_CCW)) {
        let direction = this.isFlagSet(EnemyPulsar.FLAG_ROTATION_CCW) ? 1 : -1;
        this.setLane(this.laneId + direction);
      }
    }

    if (
      this.inState(EnemyPulsar.STATE_MOVING_ALONG_LINE)
      && this.isFlagNotSet(EnemyPulsar.FLAG_MOVING_TARGET_CHOSEN)
    ) {
      this.setFlag(EnemyPulsar.FLAG_MOVING_TARGET_CHOSEN);
      this.zBase = this.zPosition;
      this.zTarget = randomRange(EnemyPulsar.MIN_Z_POSITION * 10, EnemyPulsar.MAX_Z_POSITION * 10) / 10;
    }

    if (this.inState(EnemyPulsar.STATE_MOVING_ALONG_LINE)) {
      this.zPosition = this.zBase + (this.zTarget - this.zBase) * this.stateProgressInTime();
    } else {
      this.zPosition = this.zTarget;
    }
  }

  immuneDuringNextRotation () {
    this.setFlag(EnemyPulsar.FLAG_IMMUNE_ROTATION);
    this.hittable = false;
  }

  hitByProjectile () {
    this.setState(EnemyPulsar.STATE_EXPLODING);
    this.hittable = false;
    this.clearFlags();
  }
}
