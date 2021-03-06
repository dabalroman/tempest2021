import Canvas3d from '@/Object/Screen/Canvas3d';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';
import keyboardInput from '@/utils/KeyboardInput';
import surfaces from '@/Assets/Surfaces';
import BoundingBox2 from '@/Helpers/BoundingBox2';
import messageBroker, { MessageBroker } from '@/Helpers/MessageBroker';
import readonly from '@/utils/readonly';

export default class ScreenSelectSurface extends Canvas3d {
  @readonly
  static SURFACE_COLORS = ['rgba(0, 0, 255, 1)', 'rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)'];

  /** @var {number} */
  selectedLevel = 1;

  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    super(screenContentManager, width, height, canvasResX, canvasResY);

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
      messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_MENU_SELECT);
    }
  }

  moveLeft () {
    if (this.keyInputDelay()) {
      this.moveSelection(-1);
      messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_MENU_CHANGE);
    }
  }

  moveRight () {
    if (this.keyInputDelay()) {
      this.moveSelection(1);
      messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_MENU_CHANGE);
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

    this.setFontSizePx(20);
    this.drawText('?? ROMAN DABAL & PIOTR KLOSEK ??', 282, 60, Canvas3d.COLOR_BLUE);

    this.setFontSizePx(30);
    this.drawText('rate yourself', 371, 480, Canvas3d.COLOR_GREEN);
    this.drawText('Use A and D to change', 270, 530, Canvas3d.COLOR_CYAN);
    this.drawText('Press fire to select', 284, 580, Canvas3d.COLOR_YELLOW);
    this.drawText('novice', 140, 750, Canvas3d.COLOR_RED);
    this.drawText('expert', 845, 750, Canvas3d.COLOR_RED);

    this.setFontSizePx(25);
    this.drawText('level', 30, 800, Canvas3d.COLOR_GREEN);
    this.drawText('hole', 30, 860, Canvas3d.COLOR_GREEN);
    this.drawText('bonus', 30, 920, Canvas3d.COLOR_GREEN);

    let offset = this.screenContentManager.get(ScreenContentManager.KEY_SELECT_OFFSET);
    let levels = this.screenContentManager.get(ScreenContentManager.KEY_LEVELS);
    let xOffset = 160;
    let xStep = 175;

    for (let i = 0; i < levels.length - offset && i < 5; i++) {
      let level = levels[i + offset];
      let surfaceId = ((level.id - 1) % 16) + 1;

      this.drawText(
        this.alignNumberToRight(level.id), xOffset + (i * xStep) - 40, 800, Canvas3d.COLOR_GREEN
      );

      let surfaceColor = Math.floor(level.id / 16) % 3;
      this.context.strokeStyle = ScreenSelectSurface.SURFACE_COLORS[surfaceColor];
      this.drawMapIcon(xOffset + (i * xStep) + 58, 845, surfaceId);

      this.drawText(
        this.alignNumberToRight(level.scoreBonus), xOffset + (i * xStep), 920, Canvas3d.COLOR_RED
      );
    }

    this.setFontSizePx(75);
    this.drawText('TEMPEST 2021', 160, 300, Canvas3d.COLOR_WHITE);

    this.drawRect(
      140 + xStep * this.screenContentManager.get(ScreenContentManager.KEY_SELECT_ACTIVE),
      765, xStep - 20, 165,
      ScreenSelectSurface.COLOR_BLUE
    );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} surfaceId
   * @param {number} scale
   */
  drawMapIcon (x, y, surfaceId, scale = 1) {
    let unit = 10 * scale;

    let surface = surfaces.find(surface => surface.id === surfaceId);
    if (surface === undefined) {
      return;
    }

    let boundingBox2 = new BoundingBox2.create(surface.coords);

    this.context.beginPath();

    for (let i = 0; i < surface.coords.length + (surface.isOpen ? 0 : 1); i++) {
      let cx = x + (boundingBox2.getCenter().x - surface.coords[i % 16].x) * unit;
      let cy = y + (boundingBox2.getCenter().y - surface.coords[i % 16].y) * unit;

      if (i !== 0) {
        this.context.lineTo(cx, cy);
      } else {
        this.context.moveTo(cx, cy);
      }
    }

    this.context.stroke();
  }
}
