import EnemyRenderer from '@/Renderer/EnemyRenderer';
import { Group } from 'three';

export default class EnemyRendererManager extends Group {
  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {Surface} */
  surface;

  /** @var {EnemyRenderer[]} */
  enemyRenderers = [];
  /** @var {number[]} */
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

      this.surfaceObjectsManager.rendererHelperNewObjectsIds.length = 0;
    }

    this.enemyRenderers.forEach((enemyRenderer, index) => {
      if (enemyRenderer.object === null) {
        return;
      }

      if (!enemyRenderer.object.alive) {
        enemyRenderer.breakObjectRef();

        this.enemyRenderersAvailabilityMap.push(index);
      } else {
        enemyRenderer.update();
      }
    });
  }

  /**
   * @param {Enemy} enemy
   */
  pushEnemy (enemy) {
    if (this.enemyRenderersAvailabilityMap.length) {
      console.log(`Reusing enemy renderer #${this.enemyRenderersAvailabilityMap.slice(0, 1)}`);
      this.enemyRenderers[this.enemyRenderersAvailabilityMap.shift()].setObjectRef(enemy);
    } else {
      console.log(`Creating new enemy renderer #${this.enemyRenderers.length}`);
      this.enemyRenderers.push(new EnemyRenderer(enemy, this.surface));
      this.add(this.enemyRenderers[this.enemyRenderers.length - 1]);
    }
  }
}
