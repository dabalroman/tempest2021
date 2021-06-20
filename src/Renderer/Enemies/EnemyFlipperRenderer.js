import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import { Vector2 } from 'three';
import Enemy from '@/Object/Enemies/Enemy';

export default class EnemyFlipperRenderer extends EnemyRenderer {
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

  /**
   * @param {EnemyFlipper} enemyFlipper
   * @param {Surface} surface
   */
  constructor (enemyFlipper, surface) {
    super(enemyFlipper, surface, Enemy.TYPE_FLIPPER);
  }

  updatePosition () {
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
    } else if (this.object.inState(EnemyFlipper.STATE_EXPLODING)) {
      //Temporary
      this.zRotationOffset++;
    } else {
      this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];
      this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
      this.zRotationOffset = 0;

      this.rotatingStateCache.valid = false;
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
