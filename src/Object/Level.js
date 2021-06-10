import Shooter from '@/Object/Shooter';
import SurfaceObjectsManager from '@/Object/SurfaceObjectsManager';
import ProjectileManager from '@/Object/ProjectileManager';

import keyboardInput from '@/utils/KeyboardInput';

export default class Level {
  /** @var {Surface} */
  surface;
  /** @var {Shooter} */
  shooter;
  /** @var {SurfaceObjectsManager} */
  surfaceObjectsManager;
  /** @var {ProjectileManager} */
  projectileManager;

  constructor (surface) {
    this.surface = surface;
    this.shooter = new Shooter(surface);
    this.surfaceObjectsManager = new SurfaceObjectsManager(surface);
    this.surfaceObjectsManager.addShooter(this.shooter);

    this.projectileManager = new ProjectileManager(this.surfaceObjectsManager);

    keyboardInput.register('KeyA', () => {this.shooter.moveLeft(this.surface);});
    keyboardInput.register('KeyD', () => {this.shooter.moveRight(this.surface);});
  }

  update () {
    this.projectileManager.update();
    this.surfaceObjectsManager.update();
  }
}
