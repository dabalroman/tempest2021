import ProjectileRenderer from '@/Renderer/ProjectileRenderer';
import { Group } from 'three';

export default class ProjectileRendererManager extends Group {
  /** @var {ProjectileManager} */
  projectileManager;
  /** @var {Surface} */
  surface;

  /** @var {ProjectileRenderer[]} */
  projectileRenderers = [];
  /** @var {number[]} */
  projectileRenderersAvailabilityMap = [];

  /**
   * @param {ProjectileManager} projectileManager
   * @param {Surface} surface
   */
  constructor (projectileManager, surface) {
    super();

    this.projectileManager = projectileManager;
    this.surface = surface;
  }

  update () {
    if (this.projectileManager.rendererHelperNewProjectilesIds.length !== 0) {
      this.projectileManager.shooterProjectiles
        .filter(projectile => this.projectileManager.rendererHelperNewProjectilesIds.includes(projectile.objectId))
        .forEach(projectile => {
          this.pushProjectile(projectile);
        });

      this.projectileManager.enemyProjectiles
        .filter(projectile => this.projectileManager.rendererHelperNewProjectilesIds.includes(projectile.objectId))
        .forEach(projectile => {
          this.pushProjectile(projectile);
        });

      this.projectileManager.rendererHelperNewProjectilesIds.length = 0;
    }

    this.projectileRenderers.forEach((projectileRenderer, index) => {
      if (projectileRenderer.object === null) {
        return;
      }

      if (!projectileRenderer.object.alive) {
        projectileRenderer.breakObjectRef();

        this.projectileRenderersAvailabilityMap.push(index);
      } else {
        projectileRenderer.update();
      }
    });
  }

  /**
   * @param {Projectile} projectile
   */
  pushProjectile (projectile) {
    if (this.projectileRenderersAvailabilityMap.length) {
      console.log(`Reusing projectile renderer #${this.projectileRenderersAvailabilityMap.slice(0, 1)}`);
      this.projectileRenderers[this.projectileRenderersAvailabilityMap.shift()].setObjectRef(projectile);
    } else {
      console.log(`Creating new projectile renderer #${this.projectileRenderers.length}`);
      this.projectileRenderers.push(new ProjectileRenderer(projectile, this.surface));
      this.add(this.projectileRenderers[this.projectileRenderers.length - 1]);
    }
  }
}
