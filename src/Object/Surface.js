import { Vector2 } from 'three';

export default class Surface {
  /** @var {string} name */
  name;
  /** @var {boolean} isOpen */
  isOpen;
  /** @var {number} lanesAmount */
  lanesAmount;
  /** @var {Vector2[]} lanesCoords */
  lanesCoords;

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
