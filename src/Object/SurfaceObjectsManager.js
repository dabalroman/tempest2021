export default class SurfaceObjectsManager {
  /** {Surface} */
  surface;

  /** {Shooter[]} */
  shooters = [];
  /** {Enemy[]} */
  enemies = [];

  /** {array} */
  shootersMap;
  /** {array} */
  enemiesMap;

  /**
   * @param {Surface} surface
   */
  constructor (surface) {
    this.surface = surface;
    this.shootersMap = new Array(this.surface.lanesAmount).fill(0).map(() => []);
    this.enemiesMap = new Array(this.surface.lanesAmount).fill(0).map(() => []);
  }

  addShooter (shooter) {
    this.shooters.push(shooter);
  }

  addEnemy (enemy) {
    this.enemies.push(enemy);
  }

  update () {
    this.updateMap(this.shooters, this.shootersMap);
    this.updateMap(this.enemies, this.enemiesMap);
  }

  /**
   * @param {SurfaceObject[]} objects
   * @param {array} map
   */
  updateMap (objects, map) {
    const mapNeedsUpdate = objects.filter(object => object.hasChangedLane()).length;

    if (!mapNeedsUpdate) {
      return;
    }

    map.forEach(lane => lane.length = 0);
    objects.forEach(object => map[object.laneId].push(object));
  }
}
