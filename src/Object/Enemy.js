import readonly from '@/utils/readonly';
import SurfaceObject from '@/Object/SurfaceObject';

export default class Enemy extends SurfaceObject {
  @readonly
  static ENEMY_PULSAR = 'pulsar';
  @readonly
  static ENEMY_SPIKER = 'spiker';
  @readonly
  static ENEMY_TANKER = 'tanker';
  @readonly
  static ENEMY_FLIPPER = 'flipper';
  @readonly
  static ENEMY_FUSEBALL = 'fuseball';

  /** @var {string} type */
  type;
  /** @var {number} state */
  state;
  /** @var {number} state */
  firstLevel;
  /** @var {boolean} state */
  canShoot = false;

  constructor() {
    super();

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  update() {
    throw new Error("Method 'update()' must be implemented.");
  }

  makeMove() {
    throw new Error("Method 'makeMove()' must be implemented.")
  }
}
