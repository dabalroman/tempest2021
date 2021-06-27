import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import EnemyFlipper from '@/Object/Enemies/EnemyFlipper';
import { Vector2 } from 'three';
import Enemy from '@/Object/Enemies/Enemy';

export default class EnemyFlipperRenderer extends EnemyRenderer {
  /**
   * @param {EnemyFlipper} enemyFlipper
   * @param {Surface} surface
   */
  constructor (enemyFlipper, surface) {
    super(enemyFlipper, surface, Enemy.TYPE_FLIPPER);
  }

  updateState () {
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

      if (!this.isRotationStateCacheValid()) {
        this.calculateRotationStateCacheVariables(this.object.isFlagSet(EnemyFlipper.FLAG_ROTATION_CCW) ? 1 : -1);
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
      this.explodeAnimation();

    } else if (this.object.inState(EnemyFlipper.STATE_DISAPPEARING)) {
      this.disappearingAnimation();

    } else {
      this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];
      this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
      this.zRotationOffset = 0;

      this.invalidateRotationStateCache();
    }
  }
}
