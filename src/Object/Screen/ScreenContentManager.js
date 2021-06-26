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

  setScore (score) {
    this.set(ScreenContentManager.KEY_SCORE, score);
  }

  setLives (lives) {
    this.set(ScreenContentManager.KEY_LIVES, lives);
  }

  setLevel (level) {
    this.set(ScreenContentManager.KEY_LEVEL, level);
  }
}
