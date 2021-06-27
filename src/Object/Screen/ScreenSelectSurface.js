import Canvas3d from '@/Object/Screen/Canvas3d';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';
import keyboardInput from '@/utils/KeyboardInput';

export default class ScreenSelectSurface extends Canvas3d {
  /** @var {number} */
  selectedLevel = 1;

  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    super(screenContentManager, width, height, canvasResX, canvasResY);

    this.screenContentManager.set('player', 1);
    this.registerKeys();
  }

  release () {
    this.unregisterKeys();
  }

  registerKeys () {
    keyboardInput.register('KeyA', () => { this.moveLeft(); });
    keyboardInput.register('KeyD', () => { this.moveRight(); });
    keyboardInput.register('Space', () => { this.selectLevel(); });
  }

  unregisterKeys () {
    keyboardInput.unregister('KeyA');
    keyboardInput.unregister('KeyD');
    keyboardInput.unregister('Space');
  }

  selectLevel () {
    if (this.keyInputDelay()) {
      this.screenContentManager.get(ScreenContentManager.KEY_LEVEL_SELECTED_CALLBACK)(this.selectedLevel, true);
    }
  }

  moveLeft () {
    if (this.keyInputDelay()) {
      this.moveSelection(-1);
    }
  }

  moveRight () {
    if (this.keyInputDelay()) {
      this.moveSelection(1);
    }
  }

  moveSelection (direction) {
    let currentActive = this.screenContentManager.get(ScreenContentManager.KEY_SELECT_ACTIVE);
    let currentOffset = this.screenContentManager.get(ScreenContentManager.KEY_SELECT_OFFSET);

    let desiredSelection = currentActive + currentOffset + direction;

    if (desiredSelection < 0) {
      return;
    }

    let levelsLength = this.screenContentManager.get(ScreenContentManager.KEY_LEVELS).length;
    if (desiredSelection >= levelsLength) {
      return;
    }

    if (direction === 1) {
      if (currentActive >= 4) {
        currentOffset++;
      } else {
        currentActive++;
      }
    } else {
      if (currentActive <= 0) {
        currentOffset--;
      } else {
        currentActive--;
      }
    }

    this.selectedLevel = this.screenContentManager.get(ScreenContentManager.KEY_LEVELS)[desiredSelection].id;

    this.screenContentManager.set(ScreenContentManager.KEY_SELECT_ACTIVE, currentActive);
    this.screenContentManager.set(ScreenContentManager.KEY_SELECT_OFFSET, currentOffset);
  }

  draw () {
    this.clearCanvas();

    this.setFontSizePx(30);
    // this.drawText('© mcmlxxx Atari', 355, 60, Canvas3d.COLOR_BLUE);
    this.drawText('rate yourself', 371, 410, Canvas3d.COLOR_GREEN);
    this.drawText('Spin knob to change', 296, 460, Canvas3d.COLOR_CYAN);
    this.drawText('Press fire to move selection', 184, 510, Canvas3d.COLOR_YELLOW);
    this.drawText('novice', 140, 600, Canvas3d.COLOR_RED);
    this.drawText('expert', 845, 600, Canvas3d.COLOR_RED);

    this.setFontSizePx(25);
    this.drawText('level', 30, 650, Canvas3d.COLOR_GREEN);
    this.drawText('hole', 30, 710, Canvas3d.COLOR_GREEN);
    this.drawText('bonus', 30, 770, Canvas3d.COLOR_GREEN);

    let offset = this.screenContentManager.get(ScreenContentManager.KEY_SELECT_OFFSET);
    let levels = this.screenContentManager.get(ScreenContentManager.KEY_LEVELS);
    let xOffset = 160;
    let xStep = 175;

    for (let i = 0; i < levels.length - offset; i++) {
      this.drawText(
        this.alignNumberToRight(levels[i + offset].id), xOffset + (i * xStep) - 40, 650, Canvas3d.COLOR_GREEN
      );
      this.drawMapIcon(xOffset + (i * xStep) + 30, 666, 1);
      this.drawText(
        this.alignNumberToRight(levels[i + offset].scoreBonus), xOffset + (i * xStep), 770, Canvas3d.COLOR_RED
      );
    }

    this.setFontSizePx(60);
    this.drawText('Player 1', 335, 350, Canvas3d.COLOR_WHITE);

    this.drawRect(
      140 + xStep * this.screenContentManager.get(ScreenContentManager.KEY_SELECT_ACTIVE),
      615, xStep - 20, 165,
      ScreenSelectSurface.COLOR_BLUE
    );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param level
   * @param scale
   */
  drawMapIcon (x, y, level, scale = 1) {
    let unit = 6 * scale;

    this.context.strokeStyle = Canvas3d.COLOR_BLUE;

    this.context.beginPath();
    this.context.moveTo(x + 5 * unit, y);
    this.context.lineTo(x, y + 5 * unit);
    this.context.lineTo(x + 5 * unit, y + 10 * unit);
    this.context.lineTo(x + 10 * unit, y + 5 * unit);
    this.context.lineTo(x + 5 * unit, y);
    this.context.stroke();
  }
}
