import { Group } from 'three';
import SurfaceRenderer from '@/Renderer/Surface/SurfaceRenderer';
import ShooterRenderer from '@/Renderer/Shooters/ShooterRenderer';
import ProjectileRendererManager from '@/Renderer/Surface/ProjectileRendererManager';
import EnemyRendererManager from '@/Renderer/Surface/EnemyRendererManager';
import readonly from '@/utils/readonly';

export default class LevelRenderer extends Group {
  @readonly
  static CAMERA_TO_SHOOTER_DISTANCE = 6;

  /** @var {?Level} */
  level = null;

  /** @var {PerspectiveCamera} */
  camera;
  /** @var {SurfaceRenderer} */
  surfaceRenderer;
  /** @var {ShooterRenderer} */
  shooterRenderer;
  /** @var {ProjectileRendererManager} */
  projectileRendererManager;
  /** @var {EnemyRendererManager} */
  enemyRendererManager;

  // noinspection JSValidateJSDoc
  /**
   * @param {PerspectiveCamera} camera
   */
  constructor (camera) {
    super();

    this.camera = camera;
  }

  bindLevel (level) {
    this.level = level;

    this.surfaceRenderer = new SurfaceRenderer(this.level.surface, this.level.currentLevel);
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

  followShooter () {
    let surfaceDepth = this.surfaceRenderer.surface.depth;
    let cameraZPosition = this.shooterRenderer.position.z;

    if (cameraZPosition >= surfaceDepth) {
      cameraZPosition += Math.pow(cameraZPosition - surfaceDepth, 2) * 0.05;
    }

    if (cameraZPosition < 0) {
      cameraZPosition *= 0.9;
    }

    this.camera.position.z = cameraZPosition - LevelRenderer.CAMERA_TO_SHOOTER_DISTANCE;
    this.camera.lookAt(this.camera.position.x, this.camera.position.y, this.camera.position.z + 10);
  }

  update () {
    if (this.level !== null) {
      this.surfaceRenderer.update();
      this.shooterRenderer.update();
      this.enemyRendererManager.update();
      this.projectileRendererManager.update();
      this.followShooter();
    }
  }
}
