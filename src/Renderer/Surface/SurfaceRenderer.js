import { BufferGeometry, Group, Line, LineBasicMaterial, MeshBasicMaterial, Vector3 } from 'three';
import readonly from '@/utils/readonly';
import Surface from '@/Object/Surface/Surface';
import Angle from '@/utils/Angle';

export default class SurfaceRenderer extends Group {
  @readonly
  static WIREFRAME_LINE_WIDTH = 2;
  @readonly
  static ACTIVE_LANE_COLOR = 0xffff00;
  @readonly
  static DEFAULT_LANE_COLOR = 0x0000ff;

  /** @var {string} **/
  type = 'Group';

  /** @var {Surface} surface */
  surface;

  /** @var {number} */
  connectorFrontDepth = 0;
  /** @var {number} */
  connectorBackDepth = 0;

  /** @var {Line[]} **/
  lanesLines = [];
  /** @var {Line[]} **/
  lanesConnectors = [];
  /** @var {?number} lastActiveLane */
  lastActiveLane = null;

  /** @var {LineBasicMaterial} **/
  laneActiveMaterial;
  /** @var {LineBasicMaterial} **/
  laneDefaultMaterial;

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
    this.update();
  }

  update () {
    if (this.lastActiveLane === this.surface.activeLane) {
      return;
    }

    if (this.lastActiveLane !== null) {
      this.setLaneMaterial(this.lastActiveLane, this.laneDefaultMaterial);
    }
    this.setLaneMaterial(this.surface.activeLane, this.laneActiveMaterial);

    this.lastActiveLane = this.surface.activeLane;
  }

  createLanes () {
    this.clear();

    this.connectorBackDepth = this.surface.depth;

    this.lanes = [];
    this.lanesLines = [];
    this.lanesConnectors = [];

    this.laneDefaultMaterial = new LineBasicMaterial({ color: SurfaceRenderer.DEFAULT_LANE_COLOR });
    this.laneActiveMaterial = new LineBasicMaterial({ color: SurfaceRenderer.ACTIVE_LANE_COLOR });

    for (let i = 0; i < this.getAmountOfLanes(); i++) {
      let current = this.surface.centeredLanesCoords[i];

      //Create lines
      let linePoints = [
        new Vector3(current.x, current.y, 0),
        new Vector3(current.x, current.y, this.surface.depth)
      ];

      this.lanesLines.push(
        new Line(new BufferGeometry().setFromPoints(linePoints), this.laneDefaultMaterial)
      );
    }

    for (let i = 0; i < this.getAmountOfLanes(false); i++) {
      let current = this.surface.centeredLanesCoords[i];
      let next = this.surface.centeredLanesCoords[(i + 1) % Surface.LINES_AMOUNT];

      //Create connectors
      let connectorFrontPoints = [
        new Vector3(current.x, current.y, this.connectorFrontDepth),
        new Vector3(next.x, next.y, this.connectorFrontDepth)
      ];

      let connectorBackPoints = [
        new Vector3(current.x, current.y, this.connectorBackDepth),
        new Vector3(next.x, next.y, this.connectorBackDepth)
      ];

      this.lanesConnectors.push(
        new Line(new BufferGeometry().setFromPoints(connectorFrontPoints), this.laneDefaultMaterial),
        new Line(new BufferGeometry().setFromPoints(connectorBackPoints), this.laneDefaultMaterial)
      );
    }

    this.lanesLines.forEach(line => this.add(line));
    this.lanesConnectors.forEach(connector => this.add(connector));

    // this.createCenterIndicators();
  }

  createCenterIndicators () {
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

  /**
   * @param {number} laneId
   * @param {LineBasicMaterial} material
   */
  setLaneMaterial (laneId, material) {
    this.lanesLines[laneId].material = material;
    this.lanesLines[(laneId + 1) % this.getAmountOfLanes()].material = material;
    this.lanesConnectors[laneId * 2].material = material;
    this.lanesConnectors[laneId * 2 + 1].material = material;
  }

  /**
   * @return {boolean}
   */
  getAmountOfLanes (includeOpen = true) {
    return this.surface.lanesAmount + (includeOpen && this.surface.isOpen ? 1 : 0);
  }
}
