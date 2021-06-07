import { Group } from 'three';
import Shooter from '@/Object/Shooter';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/ShooterRenderer';
import enemies from '@/maps/Enemies';
import EnemyRenderer from '@/Renderer/EnemyRenderer';

export default class LevelContainer extends Group {
  /** @var {Surface} */
  surface;
  /** @var {SurfaceRenderer} */
  surfaceRenderer;
  /** @var {Shooter} */
  shooter;
  /** @var {ShooterRenderer} */
  shooterRenderer;

  constructor (surface) {
    super();

    this.surface = surface;
    this.surfaceRenderer = new SurfaceRenderer(this.surface);
    this.shooter = new Shooter();
    this.shooterRenderer = new ShooterRenderer(this.shooter);

    this.add(this.surfaceRenderer);
    this.add(this.shooterRenderer);

    this.temporaryRenderAllEnemies();
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
  }
}
