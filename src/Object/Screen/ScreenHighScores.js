import Canvas3d from '@/Object/Screen/Canvas3d';
import keyboardInput from '@/utils/KeyboardInput';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';
import messageBroker, { MessageBroker } from '@/Helpers/MessageBroker';

export default class ScreenHighScores extends Canvas3d {
  /** @var {string[]} */
  playerName = ['A', 'A', 'A'];
  /** @var {number} */
  place = 8;
  /** @var {number} */
  score = 0;
  /** @var {{name: string, score: number}[]} */
  highScores;
  /** @var {number} */
  currentStep = 0;

  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    super(screenContentManager, width, height, canvasResX, canvasResY);

    this.highScores = [...this.screenContentManager.get(ScreenContentManager.KEY_HIGH_SCORES)];
    this.score = this.screenContentManager.get(ScreenContentManager.KEY_SCORE);

    this.place = this.highScores.findIndex(row => row.score <= this.score);
    if (this.place >= 0) {
      this.highScores.splice(this.place, 0, { name: 'AAA', score: this.score });
      this.highScores.pop();
    } else {
      this.currentStep = 3;
    }

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
    this.highScores[this.place].name = this.playerName.join('');

    messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_MENU_CHANGE);
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
    this.highScores[this.place].name = this.playerName.join('');

    messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_MENU_CHANGE);
  }

  step () {
    if (!this.keyInputDelay()) {
      return;
    }

    if (this.currentStep >= 3) {
      this.screenContentManager.get(ScreenContentManager.KEY_PUSH_HIGH_SCORE_CALLBACK)(
        this.score,
        this.playerName.join('')
      );

      this.screenContentManager.get(ScreenContentManager.KEY_CLOSE_HIGH_SCORES_SCREEN_CALLBACK)();
    }

    this.currentStep++;

    messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_MENU_SELECT);
  }

  draw () {
    this.clearCanvas();

    this.setFontSizePx(30);

    this.drawText(this.alignNumberToRight(this.score), 372, 90, Canvas3d.COLOR_BLUE);

    this.drawText(this.playerName.join(''), 548, 90, Canvas3d.COLOR_BLUE);

    this.drawText('game over', 423, 140, Canvas3d.COLOR_BLUE);

    for (let i = 0; i < this.highScores.length; i++) {
      this.drawText(this.alignNumberToRight(this.highScores[i].score), 550, 340 + (i * 50), Canvas3d.COLOR_GREEN);
      this.drawText(this.highScores[i].name, 400, 340 + (i * 50), Canvas3d.COLOR_GREEN);
      this.drawText(this.alignNumberToRight(i + 1), 200, 340 + (i * 50), Canvas3d.COLOR_GREEN);
    }

    // this.drawText('Ranking from 1 to 99', 280, 760, Canvas3d.COLOR_YELLOW);
    // this.drawText(
    //   this.alignNumberToRight(this.place === -1 ? 99 : this.place + 1) + '.',
    //   260, 810,
    //   Canvas3d.COLOR_YELLOW
    // );
    // this.drawText('player 1', 450, 810, Canvas3d.COLOR_WHITE);

    // this.drawText('© Peterkowic', 355, 950, Canvas3d.COLOR_GREEN);
    this.drawText('Bonus every 20000', 325, 1000, Canvas3d.COLOR_CYAN);

    this.drawText('Use A and D change', 310, 800, Canvas3d.COLOR_CYAN);
    this.drawText('Press fire to confirm', 274, 850, Canvas3d.COLOR_YELLOW);

    this.setFontSizePx(60);
    this.drawText('HIGH SCORES', 260, 260, Canvas3d.COLOR_YELLOW);
  }
}
