import readonly from '@/utils/readonly';
import ObjectIdManager from '@/Object/Manager/ObjectIdManager';

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

  /** @var {Surface} */
  surface;

  /** @var {number} */
  objectId;

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
    this.surface = surface;
    this.laneId = this.surface.getActualLaneIdFromProjectedMovement(laneId);
    this.type = type;
    this.objectId = ObjectIdManager.getNewId();
  }

  update () {
    throw new Error('Method \'update()\' must be implemented.');
  }

  hitByProjectile () {
    throw new Error('Method \'hitByProjectile()\' must be implemented.');
  }

  /**
   * @param {number} laneId
   */
  setLane (laneId) {
    this.lastLaneId = this.laneId;
    this.laneId = this.surface.getActualLaneIdFromProjectedMovement(laneId);
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
