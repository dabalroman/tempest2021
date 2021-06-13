import readonly from '@/utils/readonly';

export default class FIFOManager {
  @readonly
  static GARBAGE_COLLECTION_TIMEOUT_MS = 200;

  /** @var {number} */
  lastGarbageCollectorExecutionTimestamp = 0;

  /**
   * @return {boolean}
   */
  shouldTriggerGarbageCollector () {
    let now = Date.now();

    if (now - this.lastGarbageCollectorExecutionTimestamp < FIFOManager.GARBAGE_COLLECTION_TIMEOUT_MS) {
      return false;
    }

    this.lastGarbageCollectorExecutionTimestamp = now;
    return true;
  }

  /**
   * @param {Object[]} objects
   * @return {number}
   */
  static garbageCollector (objects) {
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
