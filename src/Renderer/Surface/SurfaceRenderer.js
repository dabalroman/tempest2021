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
  @readonly
  static SHORTED_LANE_COLOR = 0xffffff;

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

  /** @var {LineBasicMaterial} */
  laneActiveMaterial;
  /** @var {LineBasicMaterial} */
  laneDefaultMaterial;
  /** @var {LineBasicMaterial} */
  laneShortedMaterial;

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
    let activeLaneId = this.surface.activeLaneId;

    //Normal lanes
    for (let i = 0; i < this.surface.lanesAmount; i++) {
      this.setLinesAppearance(i, this.laneDefaultMaterial);
      this.setConnectorsAppearance(i, this.laneDefaultMaterial);
    }

    //Active lane
    this.setConnectorsAppearance(activeLaneId, this.laneActiveMaterial);
    this.setLinesAppearance(activeLaneId, this.laneActiveMaterial);
    this.setLinesAppearance(activeLaneId + 1, this.laneActiveMaterial);

    //Shorted lanes
    let shortedLanesIds = this.surface.shortedLanes
      .map((shortedStrength, laneId) => (shortedStrength > 0 ? laneId : -1))
      .filter(laneId => laneId !== -1);

    for (let i = 0; i < shortedLanesIds.length; i++) {
      let thisLaneId = shortedLanesIds[i];
      let prevShortedLaneId = (i - 1 >= 0) ? shortedLanesIds[i - 1] : shortedLanesIds[shortedLanesIds.length - 1];

      this.setConnectorsAppearance(thisLaneId, this.laneShortedMaterial, false);

      let hole = prevShortedLaneId + 1 === thisLaneId;
      this.setLinesAppearance(shortedLanesIds[i], this.laneShortedMaterial, !hole);
      this.setLinesAppearance(shortedLanesIds[i] + 1, this.laneShortedMaterial, true);
    }
  }

  createLanes () {
    this.clear();

    this.connectorBackDepth = this.surface.depth;

    this.lanes = [];
    this.lanesLines = [];
    this.lanesConnectors = [];

    this.laneDefaultMaterial = new LineBasicMaterial({ color: SurfaceRenderer.DEFAULT_LANE_COLOR });
    this.laneActiveMaterial = new LineBasicMaterial({ color: SurfaceRenderer.ACTIVE_LANE_COLOR });
    this.laneShortedMaterial = new LineBasicMaterial({ color: SurfaceRenderer.SHORTED_LANE_COLOR });

    for (let i = 0; i < this.getAmountOfLanes(); i++) {
      let current = this.surface.lanesCoords[i];

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
      let current = this.surface.lanesCoords[i];
      let next = this.surface.lanesCoords[(i + 1) % Surface.LINES_AMOUNT];

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

    this.surface.lanesMiddleCoords.forEach((center, i) => {
      let angle = this.surface.lanesCoords[i].clone();
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
   * @param {number} connectorId
   * @param {LineBasicMaterial} material
   * @param {boolean} visible
   */
  setConnectorsAppearance (connectorId, material, visible = true) {
    connectorId %= this.surface.lanesAmount;

    this.lanesConnectors[connectorId * 2].material = material;
    this.lanesConnectors[connectorId * 2 + 1].material = material;

    this.lanesConnectors[connectorId * 2].visible = visible;
    this.lanesConnectors[connectorId * 2 + 1].visible = visible;
  }

  /**
   * @param {number} lineId
   * @param {LineBasicMaterial} material
   * @param {boolean} visible
   */
  setLinesAppearance (lineId, material, visible = true) {
    lineId %= this.surface.lanesAmount;

    this.lanesLines[lineId].material = material;
    this.lanesLines[lineId].visible = visible;
  }

  /**
   * @return {boolean}
   */
  getAmountOfLanes (includeOpen = true) {
    return this.surface.lanesAmount + (includeOpen && this.surface.isOpen ? 1 : 0);
  }
}
