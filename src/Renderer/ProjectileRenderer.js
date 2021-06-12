import { BoxGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, WireframeGeometry } from 'three';
import SurfaceObjectWrapper from '@/Renderer/SurfaceObjectWrapper';
import readonly from '@/utils/readonly';

export default class ProjectileRenderer extends SurfaceObjectWrapper {
  @readonly
  static PROJECTILE_SIZE = 0.1;
  @readonly
  static PROJECTILE_WIREFRAME_COLOR = 0xffff00;
  @readonly
  static ROTATION_SPEED = 0.1;

  /** @var {BoxGeometry} */
  geometry;
  /** @var {LineBasicMaterial} */
  material;

  /**
   * @param {Projectile} projectile
   * @param {Surface} surface
   */
  constructor (projectile, surface) {
    super(projectile, surface);
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
    this.geometry = new BoxGeometry(
      ProjectileRenderer.PROJECTILE_SIZE,
      ProjectileRenderer.PROJECTILE_SIZE,
      ProjectileRenderer.PROJECTILE_SIZE
    );

    this.material = new MeshBasicMaterial({
      color: 0,
      polygonOffset: true,
      polygonOffsetFactor: 2,
      polygonOffsetUnits: 1
    });

    this.add(new Mesh(this.geometry, this.material));

    const projectileWireframe = new LineSegments(
      new WireframeGeometry(this.geometry),
      new LineBasicMaterial({
        color: ProjectileRenderer.PROJECTILE_WIREFRAME_COLOR,
      })
    );
    this.add(projectileWireframe);
  }
}
