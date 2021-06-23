import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import EnemyPulsar from '@/Object/Enemies/EnemyPulsar';
import { MeshBasicMaterial, Vector2 } from 'three';
import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';

export default class EnemyPulsarRenderer extends EnemyRenderer {
  @readonly
  static NEUTRAL_COLOR = 0x00ffff;
  @readonly
  static PULSE_COLOR = 0xffffff;

  @readonly
  static BASE_Y_SCALE = 0.2;
  @readonly
  static PULSE_Y_SCALE = 0.8;

  /** @var {number} */
  colorHelperPrevState = -1;

  /**
   * @param {EnemyPulsar} enemyPulsar
   * @param {Surface} surface
   */
  constructor (enemyPulsar, surface) {
    super(enemyPulsar, surface, Enemy.TYPE_PULSAR);
  }

  updatePosition () {
    if (
      (this.object.inState(EnemyPulsar.STATE_ROTATING_BEGIN) || this.object.inState(EnemyPulsar.STATE_ROTATING_END))
      && (this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CW) || this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CCW))
    ) {
      if (this.object.inState(EnemyPulsar.STATE_ROTATING_BEGIN)
        && this.object.prevState.equals(EnemyPulsar.STATE_ROTATING_END)
        && !this.rotatingStateCache.continuousRotationUpdate) {
        this.rotatingStateCache.continuousRotationUpdate = true;
        this.rotatingStateCache.valid = false;
      }

      if (this.object.inState(EnemyPulsar.STATE_ROTATING_END)) {
        this.rotatingStateCache.continuousRotationUpdate = false;
      }

      if (!this.isRotationStateCacheValid()) {
        this.calculateRotationStateCacheVariables(this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CCW) ? 1 : -1);
      }

      let rotationAxisLaneId = this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CW)
        ? this.rotatingStateCache.sourceLaneId
        : this.rotatingStateCache.targetLaneId;

      this.zRotationBase = this.surface.lanesCenterDirectionRadians[rotationAxisLaneId];
      this.positionBase = this.surface.lanesMiddleCoords[rotationAxisLaneId].clone();

      if (this.object.inState(EnemyPulsar.STATE_ROTATING_BEGIN)) {
        if (this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CW)) {
          this.zRotationOffset = this.rotatingStateCache.relativeHalfStep * this.object.stateProgressInTime();
        } else {
          this.zRotationOffset = this.rotatingStateCache.relativeHalfStep * (2 - this.object.stateProgressInTime());
        }
      } else {
        if (this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CW)) {
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

    } else if (this.object.inState(EnemyPulsar.STATE_EXPLODING)) {
      //Temporary
      this.zRotationOffset++;

    } else {
      this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];
      this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
      this.zRotationOffset = 0;

      this.invalidateRotationStateCache();
    }

    this.setScale();
    this.setMaterial();
  }

  setScale () {
    // noinspection JSUnresolvedVariable
    let scale = EnemyPulsarRenderer.BASE_Y_SCALE;

    if (this.object.inState(EnemyPulsar.STATE_WARNING)) {
      scale += this.object.stateProgressInTime() * EnemyPulsarRenderer.PULSE_Y_SCALE;
    }

    if (this.object.inState(EnemyPulsar.STATE_PULSATING)) {
      scale += (1 + Math.sin(this.object.stateProgressInTime() * Math.PI * 11.6)) * EnemyPulsarRenderer.PULSE_Y_SCALE;
    }

    if (this.object.isFlagSet(EnemyPulsar.FLAG_ROTATION_CCW)) {
      scale *= -1;
    }

    // noinspection JSUnresolvedVariable
    if (this.object.rendererHelperLaneChangesAmount % 2 === 1) {
      scale *= -1;
    }

    this.scale.setY(scale);
  }

  setMaterial () {
    if (this.colorHelperPrevState !== this.object.state.id) {
      let neutral = !this.object.inState(EnemyPulsar.STATE_WARNING)
        && !this.object.inState(EnemyPulsar.STATE_PULSATING);

      this.children[0].material = new MeshBasicMaterial({
        color: neutral ? EnemyPulsarRenderer.NEUTRAL_COLOR : EnemyPulsarRenderer.PULSE_COLOR
      });

      this.colorHelperPrevState = this.object.state.id;
    }
  }
}
