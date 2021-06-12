import readonly from '@/utils/readonly';

export default class SurfaceObject {
  @readonly
  static TYPE_SHOOTER = 'shooter';
  @readonly
  static TYPE_PULSAR = 'pulsar';
  @readonly
  static TYPE_SPIKER = 'spiker';
  @readonly
  static TYPE_TANKER = 'tanker';
  @readonly
  static TYPE_FLIPPER = 'flipper';
  @readonly
  static TYPE_FUSEBALL = 'fuseball';
  @readonly
  static TYPE_PROJECTILE = 'projectile';

  /** @var {number} */
  laneId = 0;
  /** @var {number} */
  lastLaneId = -1;

  /** @var {string} */
  type;
  /** @var {boolean} */
  alive = true;

  /** @var {number} */
  zPosition = 0;
  /** @var {number} */
  zSpeed = 0;

  /**
   * @param {Surface} surface
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, laneId, type) {
    this.laneId = surface.getActualLaneIdFromProjectedMovement(laneId);
    this.type = type;
  }

  update () {
    throw new Error('Method \'update()\' must be implemented.');
  }

  /**
   * @param {Surface} surface
   * @param {number} laneId
   */
  setLane (surface, laneId) {
    this.lastLaneId = this.laneId;
    this.laneId = surface.getActualLaneIdFromProjectedMovement(laneId);
  }

  /**
   * @return {boolean}
   */
  hasChangedLane () {
    let hasChangedLane = this.laneId !== this.lastLaneId;
    this.lastLaneId = this.laneId;
    return hasChangedLane;
  }
}
