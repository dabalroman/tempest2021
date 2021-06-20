import { BufferGeometry, Line, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import enemies from '@/Assets/Enemies';
import BoundingBox2 from '@/Helpers/BoundingBox2';
import SurfaceObjectWrapper from '@/Renderer/Surface/SurfaceObjectWrapper';
import Enemy from '@/Object/Enemies/Enemy';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';

export default class EnemyRenderer extends SurfaceObjectWrapper {
  /** @var {BufferGeometry[]} */
  geometry;
  /** @var {MeshBasicMaterial[]} */
  materials;
  /** @var {BoundingBox2} */
  boundingBox2;

  /** @var {Vector2} */
  positionBase = new Vector2();

  /** @var {number} */
  zRotationBase = 0;
  /** @var {number} */
  zRotationOffset = 0;

  /** @var {number} */
  xLanePosition = 0.5;

  rotatingStateCache = {
    valid: false,
    continuousRotationUpdate: false,
    relativeHalfStep: 0,
    sourceLaneId: 0,
    targetLaneId: 0,
    rotationDirection: 0
  };

  constructor (enemy, surface) {
    super(enemy, surface);
  }

  move () {
    switch (this.object.type) {
      case Enemy.TYPE_FLIPPER:
        this.moveFlipper();
        break;
      default:
        console.log(`What is that ${this.object.type} thing?`);
    }
  }

  moveFlipper () {
    if (
      (this.object.inState(EnemyFlipper.STATE_ROTATING_BEGIN) || this.object.inState(EnemyFlipper.STATE_ROTATING_END))
      && (this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CW) || this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CCW))
    ) {

      if (this.object.inState(EnemyFlipper.STATE_ROTATING_BEGIN)
        && this.object.prevState.equals(EnemyFlipper.STATE_ROTATING_END)
        && !this.rotatingStateCache.continuousRotationUpdate) {
        this.rotatingStateCache.continuousRotationUpdate = true;
        this.rotatingStateCache.valid = false;
      }

      if (this.object.inState(EnemyFlipper.STATE_ROTATING_END)) {
        this.rotatingStateCache.continuousRotationUpdate = false;
      }

      if (!this.rotatingStateCache.valid) {
        this.calculateRotationStateVariables();
      }

      let rotationAxisLaneId = this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CW)
        ? this.rotatingStateCache.sourceLaneId
        : this.rotatingStateCache.targetLaneId;

      this.zRotationBase = this.surface.lanesCenterDirectionRadians[rotationAxisLaneId];
      this.positionBase = this.surface.lanesMiddleCoords[rotationAxisLaneId].clone();

      if (this.object.inState(EnemyFlipper.STATE_ROTATING_BEGIN)) {
        if (this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CW)) {
          this.zRotationOffset = this.rotatingStateCache.relativeHalfStep * this.object.stateProgressInTime();
        } else {
          this.zRotationOffset = this.rotatingStateCache.relativeHalfStep * (2 - this.object.stateProgressInTime());
        }
      } else {
        if (this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CW)) {
          this.zRotationOffset = this.rotatingStateCache.relativeHalfStep * (this.object.stateProgressInTime() + 1);
        } else {
          this.zRotationOffset = this.rotatingStateCache.relativeHalfStep * (1 - this.object.stateProgressInTime());
        }
      }

      let positionRotationXYOffset = new Vector2().subVectors(
        this.surface.lanesCoords[rotationAxisLaneId],
        this.surface.lanesMiddleCoords[rotationAxisLaneId]
      ).rotateAround(new Vector2(0, 0), this.zRotationOffset);

      this.positionBase = this.surface.lanesCoords[rotationAxisLaneId].clone().sub(positionRotationXYOffset);
    } else {
      this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];
      this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
      this.zRotationOffset = 0;

      this.rotatingStateCache.valid = false;
    }

    this.position.set(this.positionBase.x, this.positionBase.y, this.object.zPosition * this.surface.depth);
  }

  rotate () {
    this.rotation.z = this.zRotationBase + this.zRotationOffset;
  }

  loadModel () {
    this.clear();
    this.geometry = [];
    this.materials = [];

    let enemyDataset = enemies.find(enemy => enemy.name === this.object.type);
    if (enemyDataset === undefined) {
      throw new Error('Unknown object: ' + this.object.type);
    }

    this.boundingBox2 = BoundingBox2.create([].concat(...enemyDataset.coords));

    enemyDataset.coords.forEach((xyArray, i) => {
      this.materials.push(
        new MeshBasicMaterial({
          color: Array.isArray(enemyDataset.color) ? enemyDataset.color[i] : enemyDataset.color,
        })
      );

      this.geometry.push(
        new BufferGeometry().setFromPoints(
          xyArray
            .map(xyArray => new Vector2(xyArray.x, xyArray.y))
            .map(vector2 => vector2.sub(this.boundingBox2.getCenter()))
            .map(vector2 => new Vector3(vector2.x, vector2.y, 0))
        )
      );

      this.add(new Line(this.geometry[i], this.materials[i]));
    });

    if (enemyDataset.scale) {
      this.scale.set(enemyDataset.scale.x, enemyDataset.scale.y, enemyDataset.scale.z);
    }
  }

  calculateRotationStateVariables () {
    this.rotatingStateCache.rotationDirection = this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CCW) ? 1 : -1;

    this.rotatingStateCache.sourceLaneId = this.object.laneId;
    this.rotatingStateCache.targetLaneId = this.surface.getActualLaneIdFromProjectedMovement(
      this.object.laneId + this.rotatingStateCache.rotationDirection
    );

    let currentLaneRotation = this.surface.lanesCenterDirectionRadians[this.rotatingStateCache.sourceLaneId];
    let targetLaneRotation = this.surface.lanesCenterDirectionRadians[this.rotatingStateCache.targetLaneId];
    let targetRealRotation = (targetLaneRotation + Math.PI) % (Math.PI * 2);

    let relativeStep;
    if (this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CW)) {
      if (currentLaneRotation > targetRealRotation) {
        relativeStep = (Math.PI * 2 - currentLaneRotation) + targetRealRotation;
      } else {
        relativeStep = targetRealRotation - currentLaneRotation;
      }
    } else {
      if (currentLaneRotation > targetRealRotation) {
        relativeStep = currentLaneRotation - targetRealRotation;
      } else {
        relativeStep = currentLaneRotation + (Math.PI * 2 - targetRealRotation);
      }
    }

    this.rotatingStateCache.relativeHalfStep = relativeStep / 2;
    this.rotatingStateCache.valid = true;
  }
}

