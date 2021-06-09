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
  positionChangeSpeed = 0.3;
  /** @var {number} */
  rotationChangeSpeed = 0.2;

  constructor (shooter, surface) {
    super();

    this.shooter = shooter;
    this.surface = surface;

    this.loadModel();

    this.position.set(
      this.surface.lanesCenterCoords[this.shooter.currentLane].x,
      this.surface.lanesCenterCoords[this.shooter.currentLane].y,
      -1
    );

    this.rotation.z = this.surface.lanesCenterDirectionRadians[this.shooter.currentLane];
  }

  update () {
    this.move();
    this.rotate();
  }

  move () {
    let desiredPosition = this.surface.lanesCenterCoords[this.shooter.currentLane];

    if (compareVectors(desiredPosition, this.position)) {
      return;
    }

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

  rotate () {
    let desiredRotation = this.surface.lanesCenterDirectionRadians[this.shooter.currentLane];

    if (desiredRotation === this.rotation.z) {
      return;
    }

    if (Math.abs(desiredRotation - this.rotation.z) > this.rotationChangeSpeed) {
      let leftAngularDistance, rightAngularDistance;

      if (desiredRotation < this.rotation.z) {
        leftAngularDistance = this.rotation.z - desiredRotation;
        rightAngularDistance = 2 * Math.PI - this.rotation.z + desiredRotation;
      } else {
        leftAngularDistance = 2 * Math.PI - desiredRotation + this.rotation.z;
        rightAngularDistance = desiredRotation - this.rotation.z;
      }

      let rotationDirection = leftAngularDistance > rightAngularDistance ? 1 : -1;
      this.rotation.z += rotationDirection * this.rotationChangeSpeed;

      if (this.rotation.z >= 2 * Math.PI) {
        this.rotation.z -= 2 * Math.PI;
      } else if (this.rotation.z < 0) {
        this.rotation.z += 2 * Math.PI;
      }
    } else {
      this.rotation.z = this.surface.lanesCenterDirectionRadians[this.shooter.currentLane];
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
