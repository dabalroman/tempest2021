import { Group } from 'three';
import Shooter from '@/Object/Shooter';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/ShooterRenderer';

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
  }

  update () {
    this.surfaceRenderer.update();
  }
}
