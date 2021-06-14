import FIFOManager from '@/Object/Manager/FIFOManager';

export default class SurfaceObjectsManager extends FIFOManager {
  /** {Surface} */
  surface;

  /** {Shooters[]} */
  shooters = [];
  /** {Enemy[]} */
  enemies = [];

  /** {array} */
  shootersMap;
  /** {array} */
  enemiesMap;

  /** @var {number[]} */
  rendererHelperNewObjectsIds = [];

  /**
   * @param {Surface} surface
   */
  constructor (surface) {
    super();

    this.surface = surface;
    this.shootersMap = new Array(this.surface.lanesAmount).fill(0).map(() => []);
    this.enemiesMap = new Array(this.surface.lanesAmount).fill(0).map(() => []);
  }

  addShooter (shooter) {
    this.shooters.push(shooter);
    this.rendererHelperNewObjectsIds.push(this.shooters[this.shooters.length - 1].objectId);
  }

  addEnemy (enemy) {
    this.enemies.push(enemy);
    this.rendererHelperNewObjectsIds.push(this.enemies[this.enemies.length - 1].objectId);
  }

  update () {
    this.shooters.forEach(shooter => shooter.update());
    this.enemies.forEach(enemy => enemy.update());

    this.runGarbageCollector();
    this.updateObjectsMap();
  }

  runGarbageCollector () {
    if (this.shouldTriggerGarbageCollector()) {
      const collectedEnemies = FIFOManager.garbageCollector(this.enemies);

      if (collectedEnemies) {
        this.forceMapsUpdate = true;
      }

      if (collectedEnemies) console.log(`Collected ${collectedEnemies} enemies`);
    }
  }

  updateObjectsMap () {
    FIFOManager.updateMap(this.shooters, this.shootersMap, this.forceMapsUpdate);
    FIFOManager.updateMap(this.enemies, this.enemiesMap, this.forceMapsUpdate);

    this.forceMapsUpdate = false;
  }
}
