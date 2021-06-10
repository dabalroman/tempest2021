import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/SurfaceObject';

export default class Enemy extends SurfaceObject {
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

  /** @var {string} */
  type;
  /** @var {number} */
  state;
  /** @var {boolean} */
  alive = true;
  /** @var {number} */
  firstLevel;
  /** @var {boolean} */
  canShoot = false;

  /**
   * @param {Surface} surface
   * @param {number} laneId
   * @param {string} type
   */
  constructor (surface, laneId, type) {
    super(surface, laneId);

    this.type = type;

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  update () {
    throw new Error('Method \'update()\' must be implemented.');
  }

  makeMove() {
    throw new Error("Method 'makeMove()' must be implemented.")
  }
}
