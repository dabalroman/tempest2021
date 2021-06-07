import * as Three from 'three';
import { Group, MeshBasicMaterial } from 'three';
import objLoader from '@/utils/objLoader';
import readonly from '@/utils/readonly';

export default class ShooterRenderer extends Group {
  @readonly
  static MODEL_PATH = '../models/player.obj';
  @readonly
  static MODEL_SCALE = 0.15;
  @readonly
  static MODEL_ROTATION = -Math.PI / 2;
  @readonly
  static SHOOTER_WIREFRAME_COLOR = 0xffff00;

  constructor () {
    super();

    this.position.set(0.5, -2, -1);
  }

  static create () {
    let shooterRenderer = new ShooterRenderer();

    objLoader.load(
      ShooterRenderer.MODEL_PATH,
      function (object) {
        object.traverse(function (child) {
          if (child.isMesh) {
            const shooterWireframe = new Three.LineSegments(
              new Three.WireframeGeometry(child.geometry),
              new Three.LineBasicMaterial({
                color: ShooterRenderer.SHOOTER_WIREFRAME_COLOR,
              })
            );
            child.add(shooterWireframe);

            child.material = new MeshBasicMaterial({
              color: 0,
              polygonOffset: true,
              polygonOffsetFactor: 2,
              polygonOffsetUnits: 1
            });

            child.scale.set(ShooterRenderer.MODEL_SCALE, ShooterRenderer.MODEL_SCALE, ShooterRenderer.MODEL_SCALE);
            child.rotation.y = ShooterRenderer.MODEL_ROTATION;

            shooterRenderer.add(child);
          }
        });

      },
      null,
      x => console.warn(x)
    );

    return shooterRenderer;
  }
}
