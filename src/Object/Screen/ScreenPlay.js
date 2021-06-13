import Canvas3d from '@/Object/Screen/Canvas3d';

export default class ScreenPlay extends Canvas3d {
  constructor (width, height, canvasResX = 1024, canvasResY = 1024) {
    super(width, height, canvasResX, canvasResY);

    this.setContent('score', 8670);
    this.setContent('lives', 5);
    this.setContent('level', 81);
    this.setContent('bestScore', { score: 62150, name: 'AAA' });
    this.debug = true;
  }

  draw () {
    this.setFontSizePx(60);
    this.drawText(this.alignNumberToRight(this.getContent('score')), 50, 120, Canvas3d.COLOR_BLUE);

    for (let i = 0; i < this.getContent('lives'); i++) {
      this.drawLiveIcon(50 + i * 58, 150);
    }

    this.setFontSizePx(30);
    this.drawText(this.alignNumberToRight(this.getContent('bestScore').score), 400, 90, Canvas3d.COLOR_BLUE);
    this.drawText(this.getContent('bestScore').name, 560, 90, Canvas3d.COLOR_BLUE);

    this.drawText('LEVEL', 400, 135, Canvas3d.COLOR_GREEN);
    this.drawText(this.getContent('level'), 560, 135, Canvas3d.COLOR_GREEN);
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
