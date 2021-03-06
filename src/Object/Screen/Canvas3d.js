import * as THREE from 'three';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import randomRange from '@/utils/randomRange';
import readonly from '@/utils/readonly';

export default class Canvas3d extends Mesh {
  @readonly
  static KEY_INPUT_DELAY = 200;

  @readonly
  static COLOR_RED = 'rgba(255, 0, 0, 1)';
  @readonly
  static COLOR_BLUE = 'rgb(20,20,255)';
  @readonly
  static COLOR_GREEN = 'rgb(13,194,13)';
  @readonly
  static COLOR_WHITE = 'rgb(255,255,255)';
  @readonly
  static COLOR_YELLOW = 'rgb(255,255,0)';
  @readonly
  static COLOR_CYAN = 'rgb(100,255,200)';

  /** @var {CanvasRenderingContext2D} */
  context;
  /** @var {CanvasTexture} */
  texture;

  /** @var {string} */
  fontName = 'VectorBattle';
  /** @var {FontFace} */
  vectorBattleFont;
  /** @var {boolean} */
  fontReady = false;

  /** @var {number} */
  canvasResX;
  /** @var {number} */
  canvasResY;

  /** @var {ScreenContentManager} */
  screenContentManager;
  /** @var {number} */
  lastKeyInputTimestamp = 0;

  /** @var {boolean} */
  debug = false;

  /**
   * @param {ScreenContentManager} screenContentManager
   * @param {number} width
   * @param {number} height
   * @param {number} canvasResX
   * @param {number} canvasResY
   */
  constructor (screenContentManager, width = 8, height = 8, canvasResX = 1024, canvasResY = 1024) {
    const contextRef = document.createElement('canvas').getContext('2d');
    contextRef.canvas.width = 1024;
    contextRef.canvas.height = 1024;

    const texture = new THREE.CanvasTexture(contextRef.canvas);
    texture.minFilter = THREE.LinearFilter;

    super(
      new PlaneGeometry(width, height),
      new MeshBasicMaterial({
        map: texture,
        side: DoubleSide,
        transparent: true,
      })
    );

    this.context = contextRef;
    this.texture = texture;
    this.canvasResX = canvasResX;
    this.canvasResY = canvasResY;

    this.setLineWidth();
    this.setFontSizePx(60);

    // noinspection JSUnresolvedFunction
    this.vectorBattleFont = new FontFace('VectorBattle', 'url(VectorBattle.ttf)');
    // noinspection JSUnresolvedFunction
    this.vectorBattleFont.load().then(font => {
      document.fonts.add(font);
      this.fontReady = true;
    });

    this.screenContentManager = screenContentManager;
  }

  release () {

  }

  keyInputDelay () {
    let now = Date.now();

    if (now - this.lastKeyInputTimestamp < Canvas3d.KEY_INPUT_DELAY) {
      return false;
    }

    this.lastKeyInputTimestamp = now;
    return true;
  }

  clearCanvas () {
    this.context.clearRect(0, 0, this.canvasResX, this.canvasResY);
  }

  /**
   * @param {number} width
   */
  setLineWidth (width = 2) {
    this.context.lineWidth = width;
  }

  /**
   * @param {number} size
   */
  setFontSizePx (size) {
    this.context.font = `${size}px ${this.fontName}`;
  }

  /**
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @param {number} spacing
   */
  drawText (text, x, y, color, spacing = 2) {
    if (typeof text === 'number') {
      text = text.toString();
    }

    if (spacing > 0 && spacing < 3) {
      text = text.split('').join(String.fromCharCode(8200 + spacing));
    }

    if (this.debug) {
      this.setLineWidth(1);
      let textMetrics = this.context.measureText(text);
      let offset = 8;

      this.drawRect(
        x - offset, y + offset,
        textMetrics.width + offset * 2, -textMetrics.actualBoundingBoxAscent - offset * 2,
        Canvas3d.COLOR_WHITE
      );

      this.drawLine(
        x + textMetrics.width / 2, y - textMetrics.actualBoundingBoxAscent / 2 - 50,
        x + textMetrics.width / 2, y + 50,
        Canvas3d.COLOR_WHITE
      );

      this.setLineWidth();
    }

    this.context.strokeStyle = color;
    this.context.strokeText(text, x, y);
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   * @param {string} color
   */
  drawLine (x, y, x2, y2, color) {
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} color
   */
  drawRect (x, y, w, h, color) {
    this.context.strokeStyle = color;
    this.context.strokeRect(x, y, w, h);
  }

  displayCanvasBorder () {
    this.drawRect(1, 1, this.canvasResX - 2, this.canvasResY - 2, Canvas3d.COLOR_RED);
  }

  update () {
    if (!this.fontReady) {
      return;
    }

    this.draw();

    if (this.debug) {
      this.displayCanvasBorder();
    }

    this.queueTextureUpdate();
  }

  draw () {
    this.clearCanvas();

    let color = `rgb(${randomRange(0, 256)}, ${randomRange(0, 256)}, ${randomRange(0, 256)})`;
    this.drawText('TEMPEST', randomRange(256, 500), randomRange(500, 600), color);
  }

  queueTextureUpdate () {
    this.material.map.needsUpdate = true;
  }

  alignNumberToRight (number, size = 6) {
    return number.toString().padStart(size, this.debug ? '_' : ' ');
  }
}
