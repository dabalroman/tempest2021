import { Vector2 } from 'three';
import BoundingBox2 from '@/Helpers/BoundingBox2';
import readonly from '@/utils/readonly';

export default class Surface {
  @readonly
  static LINES_AMOUNT = 16;

  /** @var {string} name */
  name;
  /** @var {boolean} isOpen */
  isOpen;
  /** @var {number} lanesAmount */
  lanesAmount;
  /** @var {Vector2[]} rawLanesCoords */
  rawLanesCoords;
  /** @var {Vector2[]} rawLanesCoords */
  lanesCoords;
  /** @var {Vector2[]} lanesMiddleCoords */
  lanesMiddleCoords;
  /** @var {number[]} lanesCenterDirectionRadians */
  lanesCenterDirectionRadians;
  /** @var {number} activeLane */
  activeLane;
  /** @var {number} depth */
  depth;

  /**
   * @param {string} name
   * @param {boolean} isOpen
   * @param {Vector2[]} lanesCoords
   */
  constructor (name, isOpen, lanesCoords) {
    this.name = name;
    this.isOpen = isOpen;
    this.rawLanesCoords = lanesCoords;
    this.lanesAmount = lanesCoords.length - (isOpen ? 1 : 0);
    this.activeLane = 0;
    this.depth = 20;

    this.calculateCenteredLanesCoords();
    this.calculateLanesCenterCoords();
    this.calculateLanesCenterDirection();
  }

  calculateCenteredLanesCoords () {
    let boundingBox2 = BoundingBox2.create(this.rawLanesCoords);
    this.lanesCoords = this.rawLanesCoords.map(vector2 => vector2.sub(boundingBox2.getCenter()));
  }

  calculateLanesCenterCoords () {
    this.lanesMiddleCoords = [];

    for (let i = 0; i < this.lanesAmount; i++) {
      let boundingBox2 = BoundingBox2.create([
        this.lanesCoords[i],
        this.lanesCoords[(i + 1) % Surface.LINES_AMOUNT]
      ]);
      this.lanesMiddleCoords.push(boundingBox2.center);
    }
  }

  calculateLanesCenterDirection () {
    this.lanesCenterDirectionRadians = [];

    this.lanesMiddleCoords.forEach((center, i) => {
      let angleVector = this.lanesCoords[i].clone();
      let axis = center.clone();

      angleVector.sub(axis).normalize();

      this.lanesCenterDirectionRadians.push(angleVector.angle());
    });
  }

  /**
   * @param {number} projectedLaneId
   * @return {number}
   */
  getActualLaneIdFromProjectedMovement (projectedLaneId) {
    if (this.isOpen) {
      if (projectedLaneId < 0) {
        return 0;
      } else if (projectedLaneId >= this.lanesAmount) {
        return this.lanesAmount - 1;
      }
      return projectedLaneId;
    } else {
      projectedLaneId %= this.lanesAmount;

      if (projectedLaneId < 0) {
        projectedLaneId += this.lanesAmount;
      }

      return projectedLaneId;
    }
  }

  /**
   * @param {number} fromLaneId
   * @param {number} toLaneId
   * @return {number}
   */
  getShortestPathDirection (fromLaneId, toLaneId) {
    if (fromLaneId === toLaneId) {
      return 0;
    }

    if (this.isOpen) {
      return (toLaneId - fromLaneId) > 0 ? 1 : -1;
    } else {
      let isDiffPositive = (toLaneId - fromLaneId) > 0;
      let cwDistance, ccwDistance;

      if (isDiffPositive) {
        cwDistance = Math.abs(toLaneId - fromLaneId);
        ccwDistance = Math.abs(toLaneId - fromLaneId - this.lanesAmount);
      } else {
        cwDistance = Math.abs(toLaneId - fromLaneId + this.lanesAmount);
        ccwDistance = Math.abs(toLaneId - fromLaneId);
      }

      let isCwShortest = cwDistance <= ccwDistance;
      return isCwShortest ? 1 : -1;
    }
  }

  /**
   * @param {number} desiredActiveLane
   */
  setActiveLane (desiredActiveLane) {
    this.activeLane = this.getActualLaneIdFromProjectedMovement(desiredActiveLane);
  }

  /**
   * @param {{name:string, isOpen: boolean, coords:{x: number, y: number}[]}[]} dataset
   * @return {Surface[]}
   */
  static fromDataset (dataset) {
    return dataset.map(data =>
      new Surface(
        data.name,
        data.isOpen,
        data.coords.map(coords =>
          new Vector2(coords.x, coords.y)
        )
      )
    );
  }
}
