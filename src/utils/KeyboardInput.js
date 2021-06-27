class KeyboardInput {
  /** @var {{key: string, keyDown: boolean, action: function}[]} **/
  keyToFunctionMap = [];

  constructor () {
    document.onkeydown = event => {
      let element = this.keyToFunctionMap.find(keyMap => keyMap.key === event.code);

      if (element !== undefined) {
        element.keyDown = true;
      }
    };

    document.onkeyup = event => {
      let element = this.keyToFunctionMap.find(keyMap => keyMap.key === event.code);

      if (element !== undefined) {
        element.keyDown = false;
      }
    };
  }

  dispatchActions () {
    this.keyToFunctionMap.filter(keyMap => keyMap.keyDown).forEach(keyMap => keyMap.action());
  }

  /**
   * @param {string} key
   * @param {function} action
   */
  register (key, action) {
    this.keyToFunctionMap.push({
        key: key,
        keyDown: false,
        action: action
      }
    );
  }

  /**
   * @param {string} key
   */
  unregister (key) {
    const index = this.keyToFunctionMap.findIndex(keyMap => keyMap.key === key);

    if (index >= 0) {
      this.keyToFunctionMap.splice(index, 1);
    }
  }

  purge () {
    this.keyToFunctionMap = [];
  }
}

const keyboardInput = new KeyboardInput();
export default keyboardInput;
