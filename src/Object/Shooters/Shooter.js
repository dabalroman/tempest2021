import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';
import State from '@/Object/Enemies/State';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFuseball from '@/Object/Enemies/EnemyFuseball';

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

  @readonly
  static FLAG_ITS_ALREADY_TOO_LATE = 0x1;

  /** @var {number} */
  lastLaneChangeTimestamp;
  /** @var {number} */
  laneChangeTimeoutMs;

  /** {SurfaceObjectsManager} */
  surfaceObjectsManager;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, surfaceObjectsManager, laneId = 0) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_SHOOTER);

    this.surfaceObjectsManager = surfaceObjectsManager;

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

    this.die();
  }

  capturedByFlipper () {
    console.log('BAM! (flipper)');

    this.die();
  }

  capturedByFuseball () {
    console.log('POW! (fuseball)');

    this.die();
  }

  impaledOnSpike () {
    console.log('SPUT! (spike)');

    this.die();
  }

  shockedByPulsar () {
    console.log('BZZZT! (pulsar)');

    this.die();
  }

  die () {
    this.setState(Shooter.STATE_EXPLODING);
    this.setFlag(Shooter.FLAG_ITS_ALREADY_TOO_LATE);
    this.hittable = false;
  }
}
