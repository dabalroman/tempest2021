import Canvas3d from '@/Object/Screen/Canvas3d';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';

export default class ScreenPlay extends Canvas3d {
  /** @var {number} */
  score = 0;
  /** @var {number} */
  targetScore = 0;
  /** @var {number} */
  scoreRisingSpeed = 10;

  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    super(screenContentManager, width, height, canvasResX, canvasResY);

    this.screenContentManager.set('score', 0);
    this.screenContentManager.set('lives', 5);
    this.screenContentManager.set('level', 81);
    this.screenContentManager.set('bestScore', { score: 62150, name: 'AAA' });
    // this.debug = true;
  }

  update () {
    this.targetScore = this.screenContentManager.get(ScreenContentManager.KEY_SCORE);

    if (this.score !== this.targetScore) {
      this.score += this.scoreRisingSpeed;

      if (this.score > this.targetScore) {
        this.score = this.targetScore;
      }
    }

    super.update();
  }

  draw () {
    this.clearCanvas();

    this.setFontSizePx(60);
    this.drawText(
      this.alignNumberToRight(this.score),
      50, 120,
      Canvas3d.COLOR_BLUE
    );

    for (let i = 0; i < this.screenContentManager.get('lives'); i++) {
      this.drawLiveIcon(50 + i * 62, 150);
    }

    this.setFontSizePx(30);
    this.drawText(this.alignNumberToRight(this.screenContentManager.get('bestScore').score), 400, 90, Canvas3d.COLOR_BLUE);
    this.drawText(this.screenContentManager.get('bestScore').name, 580, 90, Canvas3d.COLOR_BLUE);

    this.drawText('LEVEL', 400, 140, Canvas3d.COLOR_GREEN);
    this.drawText(this.alignNumberToRight(this.screenContentManager.get('level')), 505, 140, Canvas3d.COLOR_GREEN);
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
