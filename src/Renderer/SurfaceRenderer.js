import { Group } from 'three';
import readonly from '@/utils/readonly';
import LaneRenderer from '@/Renderer/LaneRenderer';

export default class SurfaceRenderer extends Group {
  @readonly
  static WIREFRAME_LINE_WIDTH = 2;

  type = 'Group';

  /** @var {Surface} surface */
  surface;
  /** @var {number} depth */
  depth = 10;
  /** @var {LaneRenderer[]} surfaceCoordsCache */
  lanes = [];

  /**
   * @constructor
   * @param {Surface} surface
   */
  constructor (surface) {
    super();

    this.castShadow = false;

    this.setSurface(surface);
  }

  /**
   * @param {Surface} surface
   */
  setSurface (surface) {
    this.surface = surface;

    this.createLanes();
  }

  createLanes () {
    this.clear();
    this.lanes = [];

    //TODO: FIND BOUNDING BOX AND APPLY TRANSFORM

    let amountOfLanes = this.surface.lanesCoords.length;
    for (let i = 0; i < amountOfLanes; i++) {
      this.lanes.push(
        new LaneRenderer(
          this.surface.lanesCoords[i],
          this.surface.lanesCoords[(i + 1) % amountOfLanes],
          10
        )
      );
    }

    this.lanes.forEach(lane => this.add(lane));
  }
}
