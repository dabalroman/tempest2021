const readonly = require("../utils/readonly");


export default class Enemy {
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
  /** @var {number} lane */
  lane = 0;
  /** @var {number} zPosition */
  zPosition = 0;
  /** @var {number} state */
  zSpeed;
  /** @var {number} state */
  firstLevel;
  /** @var {boolean} state */
  canShoot = false;

  constructor() {
    if (this.constructor === Enemy) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  update() {
    throw new Error("Method 'update()' must be implemented.");
  }

  makeMove() {
    throw new Error("Method 'makeMove()' must be implemented.")
  }
}