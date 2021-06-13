class ObjectIdManager {
  /** {number} */
  lastId = 0;

  /**
   * @return {number}
   */
  getNewId () {
    return this.lastId++;
  }
}

const objectIdManager = new ObjectIdManager();
export default objectIdManager;
