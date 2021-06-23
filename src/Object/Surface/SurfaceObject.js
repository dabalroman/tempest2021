import readonly from '@/utils/readonly';
import ObjectIdManager from '@/Helpers/UniqueIdFactory';
import State from '@/Object/Enemies/State';

export default class SurfaceObject {
  @readonly
  static TYPE_SHOOTER = 'shooter';
  @readonly
  static TYPE_PULSAR = 'pulsar';
  @readonly
  static TYPE_SPIKER = 'spiker';
  @readonly
  static TYPE_SPIKE = 'spike';
  @readonly
  static TYPE_FLIPPER_TANKER = 'flipperTanker';
  @readonly
  static TYPE_FUSEBALL_TANKER = 'fuseballTanker';
  @readonly
  static TYPE_PULSAR_TANKER = 'pulsarTanker';
  @readonly
  static TYPE_FLIPPER = 'flipper';
  @readonly
  static TYPE_FUSEBALL = 'fuseball';
  @readonly
  static TYPE_PROJECTILE = 'projectile';

  /** @var {Surface} */
  surface;

  /** @var {number} */
  objectId;

  /** @var {number} */
  laneId = 0;
  /** @var {number} */
  prevLaneId = -1;
  /** @var {boolean} */
  laneChangeMapsNeedUpdate = true;

  /** @var {string} */
  type;
  /** @var {boolean} */
  alive = true;
  /** @var {boolean} */
  hittable = true;
  /** @bar {boolean} */
  canExplode = true;

  /** @var {number} */
  zPosition = 0;
  /** @var {number} */
  zSpeed = 0;

  /** @var {State} */
  state = new State(0);
  /** @var {State} */
  prevState = new State(0);
  /** @var {number} */
  lastStateChange;

  /** @var {number} */
  flags = 0;

  /**
   * @param {Surface} surface
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, laneId, type) {
    this.surface = surface;
    this.laneId = this.surface.getActualLaneIdFromProjectedMovement(laneId);
    this.type = type;
    this.objectId = ObjectIdManager.getNewId();
  }

  update () {
    throw new Error('Method \'update()\' must be implemented.');
  }

  die () {
    throw new Error('Method \'die()\' must be implemented.');
  }

  hitByProjectile () {
    this.die();
  }

  /**
   * @param {number} laneId
   */
  setLane (laneId) {
    this.prevLaneId = this.laneId;
    this.laneId = this.surface.getActualLaneIdFromProjectedMovement(laneId);
    this.laneChangeMapsNeedUpdate = true;
  }

  /**
   * @return {boolean}
   */
  shouldUpdateFIFOMaps () {
    if (!this.laneChangeMapsNeedUpdate) {
      return false;
    }

    this.laneChangeMapsNeedUpdate = false;
    return this.laneId !== this.prevLaneId;
  }

  /** @param {State} state */
  setState (state) {
    this.prevState = this.state;
    this.state = state;
    this.lastStateChange = Date.now();
  }

  /**
   * @return {number}
   */
  timeSinceLastStateChange () {
    return Date.now() - this.lastStateChange;
  }

  /**
   * @return {number} 0 - 100%
   */
  stateProgressInTime () {
    let timeSienceLastStateChange = this.timeSinceLastStateChange();

    if (timeSienceLastStateChange >= this.state.duration) {
      return 1;
    } else {
      return timeSienceLastStateChange / this.state.duration;
    }
  }

  /**
   * @return {boolean}
   */
  canChangeState () {
    return this.timeSinceLastStateChange() > this.state.duration;
  }

  /**
   * @param {State} state
   * @return {boolean}
   */
  inState (state) {
    return this.state.equals(state);
  }

  /**
   * @param {State} state
   * @return {boolean}
   */
  prevInState (state) {
    return this.prevState.equals(state);
  }

  /**
   * @param {number} flag
   */
  setFlag (flag) {
    this.flags |= flag;
  }

  /**
   * @param {number} flag
   */
  unsetFlag (flag) {
    this.flags &= ~flag;
  }

  clearFlags () {
    this.flags = 0;
  }

  /**
   * @param {number} flag
   * @return {boolean}
   */
  isFlagSet (flag) {
    return (this.flags & flag) > 0;
  }

  /**
   * @param {number} flag
   * @return {boolean}
   */
  isFlagNotSet (flag) {
    return !this.isFlagSet(flag);
  }
}
