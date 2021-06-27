import { Group } from 'three';
import SurfaceRenderer from '@/Renderer/Surface/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/Shooters/ShooterRenderer';
import ProjectileRendererManager from '@/Renderer/Surface/ProjectileRendererManager';
import EnemyRendererManager from '@/Renderer/Surface/EnemyRendererManager';

export default class LevelRenderer extends Group {
  /** @var {?Level} */
  level = null;

  /** @var {SurfaceRenderer} */
  surfaceRenderer;
  /** @var {ShooterRenderer} */
  shooterRenderer;
  /** @var {ProjectileRendererManager} */
  projectileRendererManager;
  /** @var {EnemyRendererManager} */
  enemyRendererManager;

  bindLevel (level) {
    this.level = level;
    this.surfaceRenderer = new SurfaceRenderer(this.level.surface);
    this.shooterRenderer = new ShooterRenderer(this.level.shooter, this.level.surface);
    this.enemyRendererManager = new EnemyRendererManager(this.level.surfaceObjectsManager, this.level.surface);
    this.projectileRendererManager = new ProjectileRendererManager(this.level.projectileManager, this.level.surface);

    this.add(this.surfaceRenderer);
    this.add(this.shooterRenderer);
    this.add(this.enemyRendererManager);
    this.add(this.projectileRendererManager);

    this.position.setY(level.surface.zOffset);
  }

  releaseLevel () {
    this.remove(this.surfaceRenderer);
    this.remove(this.shooterRenderer);
    this.remove(this.enemyRendererManager);
    this.remove(this.projectileRendererManager);

    this.level = null;
    this.surfaceRenderer = undefined;
    this.shooterRenderer = undefined;
    this.enemyRendererManager = undefined;
    this.projectileRendererManager = undefined;
  }

  update () {
    if (this.level !== null) {
      this.surfaceRenderer.update();
      this.shooterRenderer.update();
      this.enemyRendererManager.update();
      this.projectileRendererManager.update();
    }
  }
}
