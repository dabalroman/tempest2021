import uniqueIdFactory from '@/Helpers/UniqueIdFactory';

export default class State {
  /** {number} */
  id;
  /** {number} */
  duration;
  /** {number} */
  probability;
  /** {string} */
  name;

  /**
   * @param {number} duration
   * @param {number} probability
   * @param {string} name
   */
  constructor (duration, probability = 1, name = '') {
    this.id = uniqueIdFactory.getNewId();
    this.duration = duration;
    this.probability = probability;
    this.name = name;
  }

  /**
   * @param {State} state
   * @return {boolean}
   */
  equals (state) {
    return this.id === state.id;
  }

  /** @param {State} states */
  static drawNextState (...states) {
    let range = states.reduce(((acc, val) => acc + val.probability), 0);
    let draw = Math.random() * range;

    for (let i = 0; i < states.length; i++) {
      if (states[i].probability >= draw) {
        return states[i];
      } else {
        draw -= states[i].probability;
      }
    }

    throw new Error('Something weird happened.');
  }
}
