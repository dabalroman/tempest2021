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
  /** @var {Vector2[]} lanesCoords */
  lanesCoords;
  /** @var {Vector2[]} lanesCoords */
  centeredLanesCoords;
  /** @var {Vector2[]} lanesCenterCoords */
  lanesCenterCoords;
  /** @var {number[]} lanesCenterDirectionRadians */
  lanesCenterDirectionRadians;
  /** @var {number} activeLane */
  activeLane;

  /**
   * @param {string} name
   * @param {boolean} isOpen
   * @param {Vector2[]} lanesCoords
   */
  constructor (name, isOpen, lanesCoords) {
    this.name = name;
    this.isOpen = isOpen;
    this.lanesCoords = lanesCoords;
    this.lanesAmount = lanesCoords.length - (isOpen ? 1 : 0);
    this.activeLane = 0;

    this.calculateCenteredLanesCoords();
    this.calculateLanesCenterCoords();
    this.calculateLanesCenterDirection();
  }

  calculateCenteredLanesCoords () {
    let boundingBox2 = BoundingBox2.create(this.lanesCoords);
    this.centeredLanesCoords = this.lanesCoords.map(vector2 => vector2.sub(boundingBox2.getCenter()));
  }

  calculateLanesCenterCoords () {
    this.lanesCenterCoords = [];

    for (let i = 0; i < this.lanesAmount; i++) {
      let boundingBox2 = BoundingBox2.create([
        this.centeredLanesCoords[i],
        this.centeredLanesCoords[(i + 1) % Surface.LINES_AMOUNT]
      ]);
      this.lanesCenterCoords.push(boundingBox2.center);
    }
  }

  calculateLanesCenterDirection () {
    this.lanesCenterDirectionRadians = [];

    this.lanesCenterCoords.forEach((center, i) => {
      let angleVector = this.centeredLanesCoords[i].clone();
      let axis = center.clone();

      angleVector.sub(axis).normalize();

      this.lanesCenterDirectionRadians.push(angleVector.angle());
    });
  }

  setActiveLane (desiredActiveLane) {
    if (this.isOpen) {
      if (desiredActiveLane >= 0 && desiredActiveLane < this.lanesAmount) {
        this.activeLane = desiredActiveLane;
      }
    } else {
      desiredActiveLane %= this.lanesAmount;

      if (desiredActiveLane < 0) {
        desiredActiveLane += this.lanesAmount;
      }

      this.activeLane = desiredActiveLane;
    }
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
