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
  /** {boolean} */
  forceMapsUpdate = false;

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
    let collectedEnemies = this.garbageCollector();
    const updatedShootersMap = this.updateMap(this.shooters, this.shootersMap, this.forceMapsUpdate);
    const updatedEnemiesMap = this.updateMap(this.enemies, this.enemiesMap, this.forceMapsUpdate);

    if (collectedEnemies) console.log(`Collected ${collectedEnemies} enemies`);
    if (updatedShootersMap) console.log('Updated shooters map');
    if (updatedEnemiesMap) console.log('Updated enemies map');

    this.forceMapsUpdate = false;
  }

  /**
   * @param {SurfaceObject[]} objects
   * @param {array} map
   * @param {boolean} forceUpdate
   * @return {boolean}
   */
  updateMap (objects, map, forceUpdate) {
    const mapNeedsUpdate = forceUpdate || objects.filter(object => object.hasChangedLane()).length;

    if (!mapNeedsUpdate) {
      return false;
    }

    map.forEach(lane => lane.length = 0);
    objects.forEach(object => map[object.laneId].push(object));

    return true;
  }

  garbageCollector () {
    if (this.enemies.length === 0) {
      return;
    }

    let indexOfAliveEnemy = this.enemies.findIndex(enemy => enemy.alive);

    if (indexOfAliveEnemy === 0) {
      return;
    }

    this.forceMapsUpdate = true;

    if (indexOfAliveEnemy === -1) {
      let temp = this.enemies.length;
      this.enemies.length = 0;
      return temp;
    } else {
      this.enemies.splice(0, indexOfAliveEnemy);
      return indexOfAliveEnemy;
    }
  }
}
