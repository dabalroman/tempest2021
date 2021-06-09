export default class SurfaceObjectsManager {
  /** {Surface} */
  surface;

  /** {Shooter[]} */
  shooters;
  /** {Enemy[]} */
  enemies;

  /** {array} */
  lanes;

  /**
   * @param {Surface} surface
   */
  constructor (surface) {
    this.surface = surface;
    console.log('hello');
  }

  updateMap () {

  }
}
