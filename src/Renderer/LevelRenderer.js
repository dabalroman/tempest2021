import { Group } from 'three';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/ShooterRenderer';
import EnemyRenderer from '@/Renderer/EnemyRenderer';
import enemies from '@/maps/Enemies';
import ProjectileRendererManager from '@/Renderer/ProjectileRendererManager';
import EnemyRendererManager from '@/Renderer/EnemyRendererManager';

export default class LevelRenderer extends Group {
  /** @var {Level} */
  level;

  /** @var {SurfaceRenderer} */
  surfaceRenderer;
  /** @var {ShooterRenderer} */
  shooterRenderer;
  /** @var {ProjectileRendererManager} */
  projectileRendererManager;
  /** @var {EnemyRendererManager} */
  enemyRendererManager;

  /**
   * @param {Level} level
   */
  constructor (level) {
    super();

    this.level = level;
    this.surfaceRenderer = new SurfaceRenderer(this.level.surface);
    this.shooterRenderer = new ShooterRenderer(this.level.shooter, this.level.surface);
    this.enemyRendererManager = new EnemyRendererManager(this.level.surfaceObjectsManager, this.level.surface);
    this.projectileRendererManager = new ProjectileRendererManager(this.level.projectileManager, this.level.surface);

    this.add(this.surfaceRenderer);
    this.add(this.shooterRenderer);
    this.add(this.enemyRendererManager);
    this.add(this.projectileRendererManager);
  }

  temporaryRenderAllEnemies () {
    enemies.forEach((enemyDataset, i) => {
      let renderer = new EnemyRenderer({ type: enemyDataset.name });
      renderer.position.z = i;
      this.add(renderer);
    });
  }

  update () {
    this.surfaceRenderer.update();
    this.shooterRenderer.update();
    this.enemyRendererManager.update();
    this.projectileRendererManager.update();
  }
}
