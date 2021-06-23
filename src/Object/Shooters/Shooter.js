import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';
import State from '@/Object/Enemies/State';

export default class Shooter extends ShootingSurfaceObject {
  @readonly
  static LANE_CHANGE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  @readonly
  static STATE_ALIVE = new State(1000, 1, 'alive');
  @readonly
  static STATE_EXPLODING = new State(1000, 1, 'exploding');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  laneChangeTimeoutMs;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, laneId = 0) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_SHOOTER);

    this.shootTimeoutMs = Shooter.SHOOT_TIMEOUT_MS;
    this.laneChangeTimeoutMs = Shooter.LANE_CHANGE_TIMEOUT_MS;
    this.zPosition = 0;
  }

  update () {
    if (this.canChangeState()) {
      if (this.inState(Shooter.STATE_EXPLODING)) {
        this.setState(Shooter.STATE_DEAD);
      }
    }
  }

  /**
   * @param {number} desiredLane
   */
  moveToLane (desiredLane) {
    let now = Date.now();

    if (now - this.lastLaneChangeTimestamp < Shooter.LANE_CHANGE_TIMEOUT_MS) {
      return;
    }

    this.setLane(desiredLane);
    this.surface.setActiveLane(this.laneId);

    this.lastLaneChangeTimestamp = now;
  }

  moveLeft () {
    this.moveToLane(this.laneId + 1);
  }

  moveRight () {
    this.moveToLane(this.laneId - 1);
  }

  hitByProjectile () {
    console.log('BOOM! (projectile)');
    this.setState(Shooter.STATE_EXPLODING);
    this.hittable = false;
  }

  capturedByFlipper () {
    console.log('BAM! (flipper)');
    this.setState(Shooter.STATE_EXPLODING);
    this.hittable = false;
  }

  capturedByFuseball () {
    console.log('POW! (fuseball)');
    this.setState(Shooter.STATE_EXPLODING);
    this.hittable = false;
  }

  impaledOnSpike () {
    console.log('SPUT! (spike)');
    this.setState(Shooter.STATE_EXPLODING);
    this.hittable = false;
  }

  shockedByPulsar () {
    console.log('BZZZT! (pulsar)');
    this.setState(Shooter.STATE_EXPLODING);
    this.hittable = false;
  }
}
