export default class FIFOManager {
  /**
   * @param {Object[]} objects
   * @return {number}
   */
  garbageCollector (objects) {
    if (objects.length === 0) {
      return 0;
    }

    let indexOfAliveObject = objects.findIndex(object => object.alive);

    if (indexOfAliveObject === 0) {
      return 0;
    }

    if (indexOfAliveObject === -1) {
      let temp = objects.length;
      objects.length = 0;
      return temp;
    } else {
      objects.splice(0, indexOfAliveObject);
      return indexOfAliveObject;
    }
  }
}
