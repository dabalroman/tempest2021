import FIFOManager from '@/Object/Manager/FIFOManager';
import Enemy from '@/Object/Enemies/Enemy';
import EnemySpike from '@/Object/Enemies/EnemySpike';

export default class SurfaceObjectsManager extends FIFOManager {
  /** {Surface} */
  surface;

  /** {Shooter[]} */
  shooters = [];
  /** {Enemy[]} */
  enemies = [];
  /** {Spike[]} */
  spikes = [];

  /** {array} */
  shootersMap;
  /** {array} */
  enemiesMap;
  /** {array} */
  spikesMap;

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
    this.spikesMap = new Array(this.surface.lanesAmount).fill(0).map(() => []);
  }

  addShooter (shooter) {
    this.shooters.push(shooter);
    this.rendererHelperNewObjectsIds.push(this.shooters[this.shooters.length - 1].objectId);
  }

  addEnemy (enemy) {
    this.enemies.push(enemy);
    this.rendererHelperNewObjectsIds.push(this.enemies[this.enemies.length - 1].objectId);

    this.createSpikes(enemy);

    return enemy;
  }

  addSpike (spike) {
    this.spikes.push(spike);
    this.rendererHelperNewObjectsIds.push(this.spikes[this.spikes.length - 1].objectId);
  }

  createSpikes (enemy) {
    if (enemy.type === Enemy.TYPE_SPIKER) {
      if (
        this.spikesMap[enemy.laneId].length === 0
        || this.spikesMap[enemy.laneId].length === this.spikesMap[enemy.laneId].filter(spike => !spike.alive).length
      ) {
        this.addSpike(new EnemySpike(enemy.surface, enemy.projectileManager, enemy.rewardCallback, enemy.laneId));
      }
    }
  }

  update () {
    this.shooters.forEach(shooter => shooter.update());
    this.enemies.forEach(enemy => enemy.update());

    this.spikes.forEach(spike => {
      spike.extendToLowestSpiker(this.enemiesMap[spike.laneId].filter(enemy => enemy.type === Enemy.TYPE_SPIKER));
      spike.update();
    });

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

      const collectedSpikes = FIFOManager.garbageCollector(this.spikes);
      if (collectedSpikes) {
        this.forceMapsUpdate = true;
      }

      if (collectedSpikes) console.log(`Collected ${collectedSpikes} spikes`);
    }
  }

  updateObjectsMap () {
    FIFOManager.updateMap(this.shooters, this.shootersMap, this.forceMapsUpdate);
    FIFOManager.updateMap(this.enemies, this.enemiesMap, this.forceMapsUpdate);
    FIFOManager.updateMap(this.spikes, this.spikesMap, this.forceMapsUpdate);

    this.forceMapsUpdate = false;
  }

  handleSuperzapper () {
    this.enemies.forEach(enemy => {
      enemy.reward = true;
      enemy.die();
    });
  }

  removeEnemies () {
    this.enemies.forEach(enemy => { enemy.disappear(); });
    this.runGarbageCollector();
    this.updateObjectsMap();
  }

  removeSpikes () {
    this.spikes.forEach(enemy => { enemy.disappear(); });
    this.runGarbageCollector();
    this.updateObjectsMap();
  }

  removeShooters () {
    this.shooters.forEach(shooter => { shooter.disappear(); });
    this.runGarbageCollector();
    this.updateObjectsMap();
  }

  purgePlayField () {
    this.removeEnemies();
    this.removeSpikes();
    this.removeShooters();
  }

  getAmountOfAliveEnemies () {
    return this.enemies.filter(enemy => enemy.alive).length;
  }
}
