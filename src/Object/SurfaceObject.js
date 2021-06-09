export default class SurfaceObject {
  /** @var {number} */
  laneId = 0;
  /** @var {number} */
  lastLaneId = -1;

  /** @var {number} */
  zPosition = 0;
  /** @var {number} */
  zSpeed = 0;

  /**
   * @param surface
   * @param laneId
   */
  setLane (surface, laneId) {
    this.laneId = surface.getActualLaneIdFromProjectedMovement(laneId);
  }

  /**
   * @return {boolean}
   */
  hasChangedLane () {
    let hasChangedLane = this.laneId !== this.lastLaneId;
    this.lastLaneId = this.laneId;
    return hasChangedLane;
  }
}
