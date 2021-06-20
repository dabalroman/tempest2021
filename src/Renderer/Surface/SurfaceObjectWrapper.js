import { Group } from 'three';

export default class SurfaceObjectWrapper extends Group {
  /** @var {SurfaceObject} */
  object;
  /** @var {Surface} */
  surface;

  /** @var {?string} */
  objectType = null;

  /**
   * @param {SurfaceObject} object
   * @param {Surface} surface
   * @param {string} objectType
   */
  constructor (object, surface, objectType) {
    super();

    this.surface = surface;
    this.objectType = objectType;
    this.setObjectRef(object);

    this.loadModel();

    this.position.set(
      this.surface.lanesMiddleCoords[this.object.laneId].x,
      this.surface.lanesMiddleCoords[this.object.laneId].y,
      this.object.zPosition * this.surface.depth
    );

    this.rotation.z = this.surface.lanesCenterDirectionRadians[this.object.laneId];
  }

  update () {
    if (this.object === null) {
      return;
    }

    this.manageVisibility();
    this.move();
    this.rotate();
  }

  manageVisibility () {
    this.visible = this.object.alive;
  }

  /**
   * @param {SurfaceObject} object
   */
  setObjectRef (object) {
    this.object = object;

    this.position.set(
      this.surface.lanesMiddleCoords[this.object.laneId].x,
      this.surface.lanesMiddleCoords[this.object.laneId].y,
      this.object.zPosition * this.surface.depth
    );

    this.rotation.z = this.surface.lanesCenterDirectionRadians[this.object.laneId];
    this.visible = true;
  }

  breakObjectRef () {
    this.object = null;
    this.visible = false;
  }

  move () {
    throw new Error('Method \'move()\' must be implemented.');
  }

  rotate () {
    throw new Error('Method \'rotate()\' must be implemented.');
  }

  loadModel () {
    throw new Error('Method \'loadModel()\' must be implemented.');
  }
}
