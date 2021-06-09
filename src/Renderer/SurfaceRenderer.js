import { BufferGeometry, Group, Line, MeshBasicMaterial, Vector3 } from 'three';
import readonly from '@/utils/readonly';
import LaneRenderer from '@/Renderer/LaneRenderer';
import Surface from '@/Object/Surface';
import Angle from '@/utils/Angle';

export default class SurfaceRenderer extends Group {
  @readonly
  static WIREFRAME_LINE_WIDTH = 2;
  @readonly
  static ACTIVE_LANE_COLOR = 0xffff00;
  @readonly
  static DEFAULT_LANE_COLOR = 0x0000ff;

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
    this.lastActiveLane = surface.activeLane;

    this.createLanes();
  }

  update () {
    if (this.lastActiveLane === this.surface.activeLane) {
      return;
    }

    this.lanes[this.surface.activeLane].setMaterial(SurfaceRenderer.ACTIVE_LANE_COLOR);

    if (this.lastActiveLane !== null) {
      this.lanes[this.lastActiveLane].setMaterial(SurfaceRenderer.DEFAULT_LANE_COLOR);
    }

    this.lastActiveLane = this.surface.activeLane;
  }

  createLanes () {
    this.clear();
    this.lanes = [];

    for (let i = 0; i < this.surface.lanesAmount; i++) {
      this.lanes.push(
        new LaneRenderer(
          this.surface.centeredLanesCoords[i],
          this.surface.centeredLanesCoords[(i + 1) % Surface.LINES_AMOUNT],
          this.depth
        )
      );
    }

    this.lanes.forEach(lane => this.add(lane));

    const material = new MeshBasicMaterial({
      color: 0x00ff00,
    });

    this.surface.lanesCenterCoords.forEach((center, i) => {
      let angle = this.surface.centeredLanesCoords[i].clone();
      let axis = center.clone();

      angle.rotateAround(axis, Angle.toRadians(-90));

      let geometry = new BufferGeometry().setFromPoints([
        new Vector3(axis.x, axis.y, 0),
        new Vector3(angle.x, angle.y, 0),
      ]);

      this.add(new Line(geometry, material));
    });
  }
}
