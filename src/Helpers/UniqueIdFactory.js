class UniqueIdFactory {
  /** {number} */
  lastId = 0;

  /**
   * @return {number}
   */
  getNewId () {
    return this.lastId++;
  }
}

const uniqueIdFactory = new UniqueIdFactory();
export default uniqueIdFactory;
