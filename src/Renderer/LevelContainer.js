import { Group } from 'three';
import Shooter from '@/Object/Shooter';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/ShooterRenderer';
import EnemyRenderer from '@/Renderer/EnemyRenderer';
import enemies from '@/maps/Enemies';
import keyboardInput from '@/utils/KeyboardInput';

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
    this.shooterRenderer = new ShooterRenderer(this.shooter, this.surface);

    this.surface.activeLane = 0;

    this.add(this.surfaceRenderer);
    this.add(this.shooterRenderer);

    keyboardInput.register('KeyA', () => {this.shooter.moveLeft(this.surface);});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight(this.surface);});

    // this.temporaryRenderAllEnemies();
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
  }
}
