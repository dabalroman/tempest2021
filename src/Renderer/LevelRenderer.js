import { Group } from 'three';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/ShooterRenderer';
import EnemyRenderer from '@/Renderer/EnemyRenderer';
import enemies from '@/maps/Enemies';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import ProjectileRendererManager from '@/Renderer/ProjectileRendererManager';

export default class LevelRenderer extends Group {
  /** @var {Level} */
  level;

  /** @var {SurfaceRenderer} */
  surfaceRenderer;
  /** @var {ShooterRenderer} */
  shooterRenderer;
  /** @var {ProjectileRendererManager} */
  projectileRendererManager;

  /**
   * @param {Level} level
   */
  constructor (level) {
    super();

    this.level = level;
    this.surfaceRenderer = new SurfaceRenderer(this.level.surface);
    this.shooterRenderer = new ShooterRenderer(this.level.shooter, this.level.surface);
    this.projectileRendererManager = new ProjectileRendererManager(this.level.projectileManager, this.level.surface);

    let enemy = new EnemyFlipper(this.level.surface);
    let enemyRenderer = new EnemyRenderer(enemy, this.level.surface);

    this.add(this.surfaceRenderer);
    this.add(this.shooterRenderer);
    this.add(this.projectileRendererManager);
    this.add(enemyRenderer);
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
    this.projectileRendererManager.update();
  }
}
