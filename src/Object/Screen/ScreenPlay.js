import Canvas3d from '@/Object/Screen/Canvas3d';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';
import messageBroker, { MessageBroker } from '@/Helpers/MessageBroker';

export default class ScreenPlay extends Canvas3d {
  /** @var {number} */
  score = 0;
  /** @var {number} */
  targetScore = 0;
  /** @var {number} */
  scoreRisingSpeed = 10;
  /** @var {boolean} */
  displaySuperzapperHint = true;

  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    super(screenContentManager, width, height, canvasResX, canvasResY);

    this.score = this.screenContentManager.get(ScreenContentManager.KEY_SCORE);
  }

  update () {
    this.targetScore = this.screenContentManager.get(ScreenContentManager.KEY_SCORE);

    if (this.score !== this.targetScore) {
      this.score += this.scoreRisingSpeed;

      if (this.score > this.targetScore) {
        this.score = this.targetScore;
      }
    }

    this.messageBrokerScreenTopicConsumer();

    super.update();
  }

  messageBrokerScreenTopicConsumer () {
    let message = messageBroker.consume(MessageBroker.TOPIC_SCREEN);

    if (message === null) {
      return;
    }

    if (message.isMessage(MessageBroker.MESSAGE_PLAYER_SUPERZAPPER_USED)) {
      this.displaySuperzapperHint = false;
    }
  }

  draw () {
    this.clearCanvas();

    this.setFontSizePx(60);
    this.drawText(
      this.alignNumberToRight(this.score),
      50, 120,
      Canvas3d.COLOR_BLUE
    );

    for (let i = 0; i < this.screenContentManager.get(ScreenContentManager.KEY_LIVES); i++) {
      this.drawLiveIcon(50 + i * 62, 150);
    }

    this.setFontSizePx(25);

    if (this.displaySuperzapperHint) {
      if (this.screenContentManager.get(ScreenContentManager.KEY_SUPERZAPPER_USED) === false) {
        this.drawText(
          'Press E to use SuperZapper',
          240, 1000,
          Canvas3d.COLOR_BLUE
        );
      }
    }

    this.drawText(
      this.alignNumberToRight(this.screenContentManager.get(ScreenContentManager.KEY_HIGHEST_SCORE).score),
      400, 90,
      Canvas3d.COLOR_BLUE
    );
    this.drawText(
      this.screenContentManager.get(ScreenContentManager.KEY_HIGHEST_SCORE).name,
      580, 90,
      Canvas3d.COLOR_BLUE
    );

    this.drawText('LEVEL', 400, 140, Canvas3d.COLOR_GREEN);
    this.drawText(
      this.alignNumberToRight(this.screenContentManager.get(ScreenContentManager.KEY_LEVEL)),
      505, 140,
      Canvas3d.COLOR_GREEN
    );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param scale
   */
  drawLiveIcon (x, y, scale = 1) {
    let unit = 3 * scale;
    this.context.strokeStyle = Canvas3d.COLOR_RED;

    this.context.beginPath();
    this.context.moveTo(x, y + 3 * unit);
    this.context.lineTo(x + 5 * unit, y + 6 * unit);
    this.context.lineTo(x + 5 * unit, y + 3.5 * unit);
    this.context.lineTo(x + 10 * unit, y + 3.5 * unit);
    this.context.lineTo(x + 10 * unit, y + 6 * unit);
    this.context.lineTo(x + 15 * unit, y + 3 * unit);
    this.context.lineTo(x + 7.5 * unit, y);
    this.context.lineTo(x, y + 3 * unit);
    this.context.stroke();
  }
}
