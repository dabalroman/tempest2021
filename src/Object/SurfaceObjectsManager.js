export default class SurfaceObjectsManager {
  /** {Surface} */
  surface;

  /** {Shooter[]} */
  shooters = [];
  /** {Enemy[]} */
  enemies = [];

  /** {array} */
  lanes = [];

  /**
   * @param {Surface} surface
   */
  constructor (surface) {
    this.surface = surface;
  }

  addShooter (shooter) {
    this.shooters.push(shooter);
  }

  addEnemy (enemy) {
    this.enemies.push(enemy);
  }

  updateMap () {
    //TODO: Create lanes map with help of hasChangedLane()
  }
}
