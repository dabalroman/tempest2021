import Canvas3d from '@/Object/Screen/Canvas3d';
import keyboardInput from '@/utils/KeyboardInput';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';

export default class ScreenHighScores extends Canvas3d {
  /** @var {string[]} */
  playerName = ['A', 'A', 'A'];

  /** @var {number} */
  currentStep = 0;

  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    super(screenContentManager, width, height, canvasResX, canvasResY);

    this.screenContentManager.set('highest_score', { score: 147098, name: 'AAA' });
    this.screenContentManager.set('rank_position', 1);

    this.registerKeys();
  }

  release () {
    this.unregisterKeys();
  }

  registerKeys () {
    keyboardInput.register('KeyA', () => { this.prevChar(); });
    keyboardInput.register('KeyD', () => { this.nextChar(); });
    keyboardInput.register('Space', () => { this.step(); });
  }

  unregisterKeys () {
    keyboardInput.unregister('KeyA');
    keyboardInput.unregister('KeyD');
    keyboardInput.unregister('Space');
  }

  nextChar () {
    if (this.currentStep >= 3 || !this.keyInputDelay()) {
      return;
    }

    let char = this.playerName[this.currentStep].charCodeAt(0);

    if (char < 90) {
      char++;
    }

    this.playerName[this.currentStep] = String.fromCharCode(char);
  }

  prevChar () {
    if (this.currentStep >= 3 || !this.keyInputDelay()) {
      return;
    }

    let char = this.playerName[this.currentStep].charCodeAt(0);

    if (char > 65) {
      char--;
    }

    this.playerName[this.currentStep] = String.fromCharCode(char);
  }

  step () {
    if (!this.keyInputDelay()) {
      return;
    }

    if (this.currentStep >= 3) {
      this.screenContentManager.get(ScreenContentManager.KEY_PUSH_HIGH_SCORE_CALLBACK)(
        this.screenContentManager.get('score'),
        this.playerName.join('')
      );

      this.screenContentManager.get(ScreenContentManager.KEY_CLOSE_HIGH_SCORES_SCREEN_CALLBACK)();
    }

    this.currentStep++;
  }

  draw () {
    this.clearCanvas();

    this.setFontSizePx(30);

    this.drawText(
      this.alignNumberToRight(this.screenContentManager.get('score')),
      372, 90,
      Canvas3d.COLOR_BLUE
    );

    this.drawText(this.playerName.join(''), 548, 90, Canvas3d.COLOR_BLUE);

    this.drawText('game over', 423, 140, Canvas3d.COLOR_BLUE);

    let highScores = this.screenContentManager.get('high_scores');
    for (let i = 0; i < highScores.length; i++) {
      this.drawText(this.alignNumberToRight(highScores[i].score), 550, 340 + (i * 50), Canvas3d.COLOR_GREEN);
      this.drawText(highScores[i].name, 400, 340 + (i * 50), Canvas3d.COLOR_GREEN);
      this.drawText(this.alignNumberToRight(i + 1), 200, 340 + (i * 50), Canvas3d.COLOR_GREEN);
    }

    this.drawText('Ranking from 1 to 99', 280, 760, Canvas3d.COLOR_YELLOW);
    this.drawText('1.', 360, 810, Canvas3d.COLOR_YELLOW);
    this.drawText('player 1', 450, 810, Canvas3d.COLOR_WHITE);

    // this.drawText('© Peterkowic', 355, 950, Canvas3d.COLOR_GREEN);
    this.drawText('Bonus every 20000', 325, 1000, Canvas3d.COLOR_CYAN);

    this.setFontSizePx(60);
    this.drawText('HIGH SCORES', 260, 260, Canvas3d.COLOR_YELLOW);
  }
}
