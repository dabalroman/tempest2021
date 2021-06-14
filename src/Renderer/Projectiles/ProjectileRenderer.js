import { BoxGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, WireframeGeometry } from 'three';
import SurfaceObjectWrapper from '@/Renderer/Surface/SurfaceObjectWrapper';
import readonly from '@/utils/readonly';
import Projectile from '@/Object/Projectiles/Projectile';

export default class ProjectileRenderer extends SurfaceObjectWrapper {
  @readonly
  static PROJECTILE_SIZE = 0.1;
  @readonly
  static PROJECTILE_SHOOTER_COLOR = 0xffff00;
  @readonly
  static PROJECTILE_ENEMY_COLOR = 0xff00ff;
  @readonly
  static ROTATION_SPEED = 0.1;

  /**
   * @param {Projectile} projectile
   * @param {Surface} surface
   */
  constructor (projectile, surface) {
    super(projectile, surface);
  }

  setObjectRef (object) {
    super.setObjectRef(object);

    if (this.children.length) {
      this.children[1].material = new LineBasicMaterial({
        color: this.getMaterialColor()
      });
    }
  }

  move () {
    this.position.z = this.object.zPosition * this.surface.depth;
  }

  rotate () {
    this.rotation.x += ProjectileRenderer.ROTATION_SPEED;
    this.rotation.y += ProjectileRenderer.ROTATION_SPEED;
  }

  loadModel () {
    this.clear();
    let geometry = new BoxGeometry(
      ProjectileRenderer.PROJECTILE_SIZE,
      ProjectileRenderer.PROJECTILE_SIZE,
      ProjectileRenderer.PROJECTILE_SIZE
    );

    let material = new MeshBasicMaterial({
      color: 0,
      polygonOffset: true,
      polygonOffsetFactor: 2,
      polygonOffsetUnits: 1
    });

    this.add(new Mesh(geometry, material));

    const projectileWireframe = new LineSegments(
      new WireframeGeometry(geometry),
      new LineBasicMaterial({
        color: this.getMaterialColor()
      })
    );
    this.add(projectileWireframe);
  }

  getMaterialColor () {
    return this.object.source === Projectile.SOURCE_SHOOTER
      ? ProjectileRenderer.PROJECTILE_SHOOTER_COLOR
      : ProjectileRenderer.PROJECTILE_ENEMY_COLOR;
  }
}
