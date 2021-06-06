import {Group} from 'three';
import readonly from '@/utils/readonly';
import LaneRenderer from '@/Renderer/LaneRenderer';

export default class SurfaceRenderer extends Group {
  @readonly
  static WIREFRAME_LINE_WIDTH = 2;
  @readonly
  static ACTIVE_LANE_COLOR = 0xffff00;
  @readonly
  static DEFAULT_LANE_COLOR = 0xff0000;

  type = 'Group';

  /** @var {Surface} surface */
  surface;
  /** @var {number} depth */
  depth = 10;
  /** @var {LaneRenderer[]} surfaceCoordsCache */
  lanes = [];
  /** @var {?number} lastActiveLane */
  lastActiveLane = null;

  /**
   * @constructor
   * @param {Surface} surface
   */
  constructor(surface) {
    super();

    this.castShadow = false;

    this.setSurface(surface);
  }

  /**
   * @param {Surface} surface
   */
  setSurface(surface) {
    this.surface = surface;

    this.createLanes();
  }

  update() {
    if (this.lastActiveLane === this.surface.activeLane) {
      return;
    }

    this.lanes[this.surface.activeLane].setMaterial(SurfaceRenderer.ACTIVE_LANE_COLOR);

    if(this.lastActiveLane) {
      this.lanes[this.lastActiveLane].setMaterial(SurfaceRenderer.DEFAULT_LANE_COLOR);
    }

    this.lastActiveLane = this.surface.activeLane;
  }

  createLanes() {
    this.clear();
    this.lanes = [];

    let amountOfLanes = this.surface.lanesCoords.length;
    for (let i = 0; i < amountOfLanes; i++) {
      this.lanes.push(
        new LaneRenderer(
          this.surface.centeredLanesCoords[i],
          this.surface.centeredLanesCoords[(i + 1) % amountOfLanes],
          10
        )
      );
    }

    this.lanes.forEach(lane => this.add(lane));
  }
}
