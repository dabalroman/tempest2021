import * as Three from 'three';
import { Group, MeshBasicMaterial } from 'three';
import objLoader from '@/utils/objLoader';
import readonly from '@/utils/readonly';
import compareVectors from '@/utils/compareVectors';

export default class ShooterRenderer extends Group {
  @readonly
  static MODEL_PATH = '../models/player.obj';
  @readonly
  static MODEL_SCALE = 0.15;
  @readonly
  static MODEL_ROTATION = -Math.PI / 2;
  @readonly
  static SHOOTER_WIREFRAME_COLOR = 0xffff00;

  /** @var {Shooter} */
  shooter;
  /** @var {Surface} */
  surface;
  /** @var {number} */
  positionChangeSpeed = 0.1;
  /** @var {number} */
  rotationChangeSpeed = 0.1;

  constructor (shooter, surface) {
    super();

    this.shooter = shooter;
    this.surface = surface;

    this.loadModel();
    this.position.set(0.5, -2, -1);
  }

  update () {
    this.move();
  }

  move () {
    let desiredPosition = this.surface.lanesCenterCoords[this.surface.activeLane];

    if (!compareVectors(desiredPosition, this.position)) {
      let movement = desiredPosition.clone();
      movement.sub(this.position);
      movement.setLength(this.positionChangeSpeed);

      if (Math.abs(movement.x) > Math.abs(desiredPosition.x - this.position.x)) {
        movement.x = desiredPosition.x - this.position.x;
      }

      if (Math.abs(movement.y) > Math.abs(desiredPosition.y - this.position.y)) {
        movement.y = desiredPosition.y - this.position.y;
      }

      this.position.set(this.position.x + movement.x, this.position.y + movement.y, this.position.z);
    }
  }

  loadModel () {
    let that = this;
    objLoader.load(
      ShooterRenderer.MODEL_PATH,
      (object) => {
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

            that.add(child);
          }
        });
      },
      null,
      x => console.warn(x)
    );
  }
}
