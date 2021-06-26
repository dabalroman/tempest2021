export default class ContentManager {
  content = [];
  updateFlag = false;

  /**
   * @param {string} key
   * @param {*} value
   */
  set (key, value) {
    this.content[key] = value;
    this.setUpdateFlag();
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get (key) {
    return this.content[key];
  }

  setUpdateFlag () {
    this.updateFlag = true;
  }

  unsetUpdateFlag () {
    this.updateFlag = false;
  }

  /**
   * @return {boolean}
   */
  isUpdateFlagSet () {
    return this.updateFlag;
  }
}
