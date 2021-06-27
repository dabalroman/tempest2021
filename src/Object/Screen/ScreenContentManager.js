import ContentManager from '@/Helpers/ContentManager';
import readonly from '@/utils/readonly';

export default class ScreenContentManager extends ContentManager {
  @readonly
  static KEY_PLAYER_ID = 'player_id';
  @readonly
  static KEY_SCORE = 'score';
  @readonly
  static KEY_BEST_SCORE = 'best_score';
  @readonly
  static KEY_LIVES = 'lives';
  @readonly
  static KEY_LEVEL = 'level';
  @readonly
  static KEY_SELECT_OFFSET = 'select_offset';
  @readonly
  static KEY_SELECT_ACTIVE = 'select_active';
  @readonly
  static KEY_LEVELS = 'levels';
  @readonly
  static KEY_HIGH_SCORES = 'high_scores';
  @readonly
  static KEY_RANK_POSITION = 'rank_position';
  @readonly
  static KEY_LEVEL_SELECTED_CALLBACK = 'level_selected_callback';

  /**
   * @param {number} score
   */
  setScore (score) {
    this.set(ScreenContentManager.KEY_SCORE, score);
  }

  /**
   * @param {number} lives
   */
  setLives (lives) {
    this.set(ScreenContentManager.KEY_LIVES, lives);
  }

  /**
   * @param {number} level
   */
  setLevel (level) {
    this.set(ScreenContentManager.KEY_LEVEL, level);
  }

  /**
   * @param {number} offset
   */
  setSelectOffset (offset) {
    this.set(ScreenContentManager.KEY_SELECT_OFFSET, offset);
  }

  /**
   * @param {number} active
   */
  setSelectActive (active) {
    this.set(ScreenContentManager.KEY_SELECT_ACTIVE, active);
  }

  /**
   * @param {{id: number, score: number}[]} levels
   */
  setSelectLevels (levels) {
    this.set(ScreenContentManager.KEY_LEVELS, levels);
  }

  /**
   * @param {function} levelSelectedCallback
   */
  setLevelSelectedCallback (levelSelectedCallback) {
    this.set(ScreenContentManager.KEY_LEVEL_SELECTED_CALLBACK, levelSelectedCallback);
  }
}