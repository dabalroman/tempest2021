export default class ObjectIdManager {
  /** {number} */
  lastId = 0;

  /**
   * @return {number}
   */
  getNewId () {
    return this.lastId++;
  }
}
