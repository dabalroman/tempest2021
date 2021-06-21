import { Group } from 'three';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFlipperRenderer from '@/Renderer/Enemies/EnemyFlipperRenderer';
import EnemySpikerRenderer from '@/Renderer/Enemies/EnemySpikerRenderer';
import EnemySpikeRenderer from '@/Renderer/Enemies/EnemySpikeRenderer';
import EnemyFlipperTankerRenderer from '@/Renderer/Enemies/EnemyFlipperTankerRenderer';

export default class EnemyRendererManager extends Group {
  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {Surface} */
  surface;

  /** @var {EnemyRenderer[]} */
  enemyRenderers = [];
  /** @var {number[][]} */
  enemyRenderersAvailabilityMap = [];

  /**
   * @param {SurfaceObjectsManager} surfaceObjectsManager
   * @param {Surface} surface
   */
  constructor (surfaceObjectsManager, surface) {
    super();

    this.surfaceObjectsManager = surfaceObjectsManager;
    this.surface = surface;
  }

  update () {
    if (this.surfaceObjectsManager.rendererHelperNewObjectsIds.length !== 0) {
      this.surfaceObjectsManager.enemies
        .filter(enemy => this.surfaceObjectsManager.rendererHelperNewObjectsIds.includes(enemy.objectId))
        .forEach(enemy => {
          this.pushEnemy(enemy);
        });

      this.surfaceObjectsManager.spikes
        .filter(spike => this.surfaceObjectsManager.rendererHelperNewObjectsIds.includes(spike.objectId))
        .forEach(spike => {
          this.pushEnemy(spike);
        });

      this.surfaceObjectsManager.rendererHelperNewObjectsIds.length = 0;
    }

    this.enemyRenderers.forEach((enemyRenderer, index) => {
      if (enemyRenderer.object === null) {
        return;
      }

      if (!enemyRenderer.object.alive) {
        if (!(enemyRenderer.objectType in this.enemyRenderersAvailabilityMap)) {
          this.enemyRenderersAvailabilityMap[enemyRenderer.objectType] = [];
        }

        this.enemyRenderersAvailabilityMap[enemyRenderer.objectType].push(index);

        enemyRenderer.breakObjectRef();
      } else {
        enemyRenderer.update();
      }
    });
  }

  /**
   * @param {Enemy} enemy
   */
  pushEnemy (enemy) {
    if (enemy.type in this.enemyRenderersAvailabilityMap && this.enemyRenderersAvailabilityMap[enemy.type].length) {
      // console.log(`Reusing enemy renderer #${this.enemyRenderersAvailabilityMap[enemy.type].slice(0, 1)}`);
      this.enemyRenderers[this.enemyRenderersAvailabilityMap[enemy.type].shift()].setObjectRef(enemy);
    } else {
      // console.log(`Creating new enemy renderer #${this.enemyRenderers.length} for ${enemy.type}`);
      this.enemyRenderers.push(this.enemyRendererFactory(enemy));
      this.add(this.enemyRenderers[this.enemyRenderers.length - 1]);
    }
  }

  /**
   * @param {Enemy|EnemyFlipper|EnemySpiker|EnemySpike|EnemyFlipperTanker} enemy
   */
  enemyRendererFactory (enemy) {
    switch (enemy.type) {
      case Enemy.TYPE_FLIPPER:
        return new EnemyFlipperRenderer(enemy, this.surface);
      case Enemy.TYPE_SPIKER:
        return new EnemySpikerRenderer(enemy, this.surface);
      case Enemy.TYPE_SPIKE:
        return new EnemySpikeRenderer(enemy, this.surface);
      case Enemy.TYPE_FLIPPER_TANKER:
        return new EnemyFlipperTankerRenderer(enemy, this.surface);
      default:
        throw new Error(`Can't find constructor for enemy of type ${enemy.type}`);
    }
  }
}
