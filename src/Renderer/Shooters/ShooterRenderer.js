import * as Three from 'three';
import { Group, MeshBasicMaterial } from 'three';
import objLoader from '@/utils/objLoader';
import readonly from '@/utils/readonly';
import compareVectors from '@/utils/compareVectors';
import SurfaceObjectWrapper from '@/Renderer/Surface/SurfaceObjectWrapper';
import Shooter from '@/Object/Shooters/Shooter';

export default class ShooterRenderer extends SurfaceObjectWrapper {
  @readonly
  static MODEL_PATH = '../models/player.obj';
  @readonly
  static MODEL_SCALE = 0.15;
  @readonly
  static MODEL_ROTATION = -Math.PI / 2;
  @readonly
  static MODEL_Z_OFFSET = -0.3;
  @readonly
  static SHOOTER_WIREFRAME_COLOR = 0xffff00;
  @readonly
  static EXPLOSION_ROTATION_SPEED = 0.03;

  /** @var {number} */
  positionChangeSpeed = 0.3;
  /** @var {number} */
  rotationChangeSpeed = 0.2;

  constructor (shooter, surface) {
    super(shooter, surface, Shooter.TYPE_SHOOTER);
  }

  setVisualsToNormal () {
    this.explosionGroup.visible = false;
  }

  setVisualsToExplode () {
    this.explosionGroup.visible = true;
  }

  updateState () {
    if (this.object.inState(Shooter.STATE_EXPLODING)) {
      this.explodeAnimation();

    } else if (this.object.inState(Shooter.STATE_DISAPPEARING)) {
      this.disappearingAnimation();

    } else if (this.object.inState(Shooter.STATE_RENOVATING)) {
      this.renovatingAnimation();

    } else {
      this.setVisualsToNormal();
    }
  }

  disappearingAnimation () {
    let scale = Math.pow(this.object.stateProgressInTime() * 2 - 1, 4);

    if (this.object.stateProgressInTime() <= 0.5) {
      let modelScale = scale;
      this.modelGroup.scale.set(modelScale, modelScale, modelScale);
    } else {
      this.modelGroup.visible = false;
    }
  }

  renovatingAnimation () {
    let modelScale = Math.pow(this.object.stateProgressInTime(), 2);
    this.modelGroup.scale.set(modelScale, modelScale, modelScale);
    this.modelGroup.visible = true;
  }

  explodeAnimation () {
    this.setVisualsToExplode();
    this.zRotationOffset += ShooterRenderer.EXPLOSION_ROTATION_SPEED;

    let scale = Math.pow(this.object.stateProgressInTime() * 2 - 1, 4);
    let explosionScale = 1 - scale;
    this.explosionGroup.scale.set(explosionScale, explosionScale, explosionScale);

    if (this.object.stateProgressInTime() <= 0.5) {
      let modelScale = scale;
      this.modelGroup.scale.set(modelScale, modelScale, modelScale);
    } else {
      this.modelGroup.visible = false;
    }
  }

  move () {
    let desiredPosition = this.surface.lanesMiddleCoords[this.object.laneId];

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

    this.position.set(
      this.position.x + movement.x,
      this.position.y + movement.y,
      this.object.zPosition * this.surface.depth
    );
  }

  rotate () {
    let desiredRotation = this.surface.lanesCenterDirectionRadians[this.object.laneId];

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
      this.rotation.z = this.surface.lanesCenterDirectionRadians[this.object.laneId];
    }
  }

  loadModel () {
    let that = this;
    this.modelGroup = new Group();

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
            child.position.z = ShooterRenderer.MODEL_Z_OFFSET;

            that.modelGroup.add(child);
          }
        });
      },
      null,
      x => console.warn(x)
    );

    this.add(this.modelGroup);
  }
}
