import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import State from '@/Object/Enemies/State';
import SurfaceObject from '@/Object/Surface/SurfaceObject';
import EnemySpiker from '@/Object/Enemies/EnemySpiker';

export default class EnemySpike extends Enemy {
  @readonly
  static HEIGHT_LIMIT = 0.9;
  @readonly
  static HUNK_LENGTH = 0.02;
  @readonly
  static HIT_DESTROYED_LENGTH = 0.1;

  @readonly
  static STATE_ALIVE = new State(500, 1, 'alive');
  @readonly
  static STATE_DEAD = new State(0, 1, 'dead');

  /** {number} */
  rendererHelperZPositionChanged = false;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {number} laneId
   */
  constructor (surface, projectileManager, laneId = 0) {
    super(surface, projectileManager, laneId, SurfaceObject.TYPE_SPIKE);

    this.canShoot = false;
    this.canExplode = false;
  }

  updateState () {
    if (this.inState(EnemySpike.STATE_DEAD)) {
      this.alive = false;
    }
  }

  updateEntity () {}

  /**
   * @param {EnemySpiker[]} spikers
   */
  extendToLowestSpiker (spikers) {
    if (spikers.length === 0) {
      return;
    }

    spikers = spikers.filter(spiker => spiker.alive && !spiker.inState(EnemySpiker.STATE_EXPLODING));

    let lowestSpikerZPosition = spikers
      .map(spiker => spiker.zPosition)
      .reduce((lowest, val) => (lowest < val ? lowest : val), 1);

    this.extendTo(lowestSpikerZPosition);
  }

  /**
   * @param {number} zPosition
   */
  extendTo (zPosition) {
    let newZPosition = Math.ceil(zPosition / EnemySpike.HUNK_LENGTH) * EnemySpike.HUNK_LENGTH;

    if (this.zPosition > newZPosition) {
      this.zPosition = newZPosition;
      this.rendererHelperZPositionChanged = true;
    }
  }

  hitByProjectile () {
    this.zPosition += EnemySpike.HIT_DESTROYED_LENGTH;
    this.rendererHelperZPositionChanged = true;

    if (this.zPosition + EnemySpike.HIT_DESTROYED_LENGTH >= 1) {
      this.die();
    }
  }

  die () {
    this.setState(EnemySpike.STATE_DEAD);
    this.hittable = false;
    this.clearFlags();
  }

  /**
   * @return {boolean}
   */
  shouldRerenderSpikeDueToSpikeLengthChange () {
    if (this.rendererHelperZPositionChanged) {
      this.rendererHelperZPositionChanged = false;
      return true;
    }

    return false;
  }
}
