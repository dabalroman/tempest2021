import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';
import State from '@/Object/State';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';

export default class Shooter extends ShootingSurfaceObject {
  @readonly
  static LANE_CHANGE_TIMEOUT_MS = 50;
  @readonly
  static SHOOT_TIMEOUT_MS = 80;
  @readonly
  static BURST_PENALTY_MS = 1000;

  /** @var {number} */
  penaltyTimestamp = 0;

  @readonly
  static STATE_ALIVE = new State(1000, 1, 'alive');
  @readonly
  static STATE_EXPLODING = new State(1000, 1, 'exploding');
  @readonly
  static STATE_DISAPPEARING = new State(1000, 1, 'disappearing');
  @readonly
  static STATE_RENOVATING = new State(1000, 1, 'renovating');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  @readonly
  static FLAG_ITS_ALREADY_TOO_LATE = 0x1;
  @readonly
  static FLAG_SUPERZAPPER_USED = 0x2;

  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  laneChangeTimeoutMs;

  /** {SurfaceObjectsManager} */
  surfaceObjectsManager;

  /** @var {function} */
  killedCallback;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {function} killedCallback
   * @param {number} laneId
   */
  constructor (
    surface,
    projectileManager,
    surfaceObjectsManager,
    killedCallback,
    laneId = 0
  ) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_SHOOTER);

    this.surfaceObjectsManager = surfaceObjectsManager;
    this.killedCallback = killedCallback;

    this.zPosition = 0;

    this.shootTimeoutMs = Shooter.SHOOT_TIMEOUT_MS;
    this.laneChangeTimeoutMs = Shooter.LANE_CHANGE_TIMEOUT_MS;

    this.surface.setActiveLane(laneId);
    this.setState(Shooter.STATE_ALIVE);
  }

  update () {
    if (this.alive === false) {
      // this.setState(Shooter.STATE_DEAD);
      return;
    }

    if (this.canChangeState()) {
      if (this.inState(Shooter.STATE_RENOVATING)) {
        this.hittable = true;
        this.canShoot = true;

        this.setState(Shooter.STATE_ALIVE);
      }

      if (this.inState(Shooter.STATE_EXPLODING)) {
        this.setState(Shooter.STATE_DEAD);
        this.killedCallback();
      }

      if (this.inState(Shooter.STATE_DISAPPEARING)) {
        this.setState(Shooter.STATE_DEAD);
      }

      if (this.inState(Shooter.STATE_DEAD)) {
        this.alive = false;
      }
    }

    if (this.isFlagNotSet(Shooter.FLAG_ITS_ALREADY_TOO_LATE)) {
      this.handleShortedLanes();
      this.handleCaptureByEnemy();
    }
  }

  handleShortedLanes () {
    if (this.surface.isLaneShorted(this.laneId)) {
      this.shockedByPulsar();
    }
  }

  handleCaptureByEnemy () {
    let enemiesMapRef = this.surfaceObjectsManager.enemiesMap[this.laneId];

    if (enemiesMapRef.length > 0) {
      enemiesMapRef.forEach(enemy => {
        if (enemy.type === Enemy.TYPE_FLIPPER && enemy.isFlagSet(EnemyFlipper.FLAG_REACHED_SHOOTER)) {
          this.capturedByFlipper();
        }

        if (enemy.type === Enemy.TYPE_FUSEBALL && enemy.isFlagSet(EnemyFuseball.FLAG_REACHED_SHOOTER)) {
          this.capturedByFuseball();
        }
      });
    }
  }

  /**
   * @param {number} desiredLane
   */
  moveToLane (desiredLane) {
    if (!this.inState(Shooter.STATE_ALIVE)) {
      return;
    }

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

  fire () {
    let now = Date.now();

    if (now - this.penaltyTimestamp < Shooter.BURST_PENALTY_MS) {
      return;
    }

    if (super.fire() === false) {
      this.penaltyTimestamp = now;
    }
  }

  hitByProjectile () {
    console.log('BOOM! (projectile)');
    this.setState(Shooter.STATE_EXPLODING);
    this.die();
  }

  capturedByFlipper () {
    console.log('BAM! (flipper)');
    this.setState(Shooter.STATE_EXPLODING);
    this.die();
  }

  capturedByFuseball () {
    console.log('POW! (fuseball)');
    this.setState(Shooter.STATE_EXPLODING);
    this.die();
  }

  impaledOnSpike () {
    console.log('SPUT! (spike)');
    this.setState(Shooter.STATE_EXPLODING);
    this.die();
  }

  shockedByPulsar () {
    console.log('BZZZT! (pulsar)');
    this.setState(Shooter.STATE_EXPLODING);
    this.die();
  }

  die () {
    this.setFlag(Shooter.FLAG_ITS_ALREADY_TOO_LATE);
    this.hittable = false;
    this.canShoot = false;
  }

  disappear () {
    if (this.inState(Shooter.STATE_EXPLODING) || this.inState(Shooter.STATE_DEAD)) {
      return;
    }

    this.setState(Shooter.STATE_DISAPPEARING);
    this.die();
  }

  fireSuperzapper () {
    if (this.inState(Shooter.STATE_ALIVE) && this.isFlagNotSet(Shooter.FLAG_SUPERZAPPER_USED)) {
      this.setFlag(Shooter.FLAG_SUPERZAPPER_USED);

      this.surfaceObjectsManager.handleSuperzapper();
    }
  }

  renovate () {
    this.setState(Shooter.STATE_RENOVATING);
    this.alive = true;

    let superzapperUsed = this.isFlagSet(Shooter.FLAG_SUPERZAPPER_USED);
    this.clearFlags();

    if (superzapperUsed) {
      this.setFlag(Shooter.FLAG_SUPERZAPPER_USED);
    }
  }
}
