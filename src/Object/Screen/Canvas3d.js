import * as THREE from 'three';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import randomRange from '@/utils/randomRange';
import readonly from '@/utils/readonly';

export default class Canvas3d extends Mesh {
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

  /** @var {array} */
  content = [];
  /** @var {boolean} */
  needRedraw = true;

  /** @var {boolean} */
  debug = false;

  /**
   * @param {number} width
   * @param {number} height
   * @param {number} canvasResX
   * @param {number} canvasResY
   */
  constructor (width, height, canvasResX = 1024, canvasResY = 1024) {
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

    this.setLineWidth(2);
    this.setFontSizePx(60);

    // noinspection JSUnresolvedFunction
    this.vectorBattleFont = new FontFace('VectorBattle', 'url(VectorBattle.ttf)');
    // noinspection JSUnresolvedFunction
    this.vectorBattleFont.load().then(font => {
      document.fonts.add(font);
      this.fontReady = true;
    });
  }

  clearCanvas () {
    this.context.clearRect(0, 0, this.canvasResX, this.canvasResY);
  }

  /**
   * @param {number} width
   */
  setLineWidth (width) {
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
   */
  drawText (text, x, y, color) {
    this.context.strokeStyle = color;
    this.context.strokeText(text, x, y);
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  displayCanvasBorder () {
    this.context.strokeStyle = Canvas3d.COLOR_RED;
    this.context.strokeRect(1, 1, this.canvasResX - 2, this.canvasResY - 2);
  }

  update () {
    if (!this.fontReady || !this.needRedraw) {
      return;
    }

    this.draw();

    if (this.debug) {
      this.displayCanvasBorder();
    }

    this.queueTextureUpdate();
    this.needRedraw = false;
  }

  draw () {
    this.clearCanvas();

    let color = `rgb(${randomRange(0, 256)}, ${randomRange(0, 256)}, ${randomRange(0, 256)})`;
    this.drawText('TEMPEST', randomRange(256, 500), randomRange(500, 600), color);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  setContent (key, value) {
    this.content[key] = value;
    this.queueRedraw();
  }

  /**
   * @param {string} key
   * @return {*}
   */
  getContent (key) {
    return this.content[key];
  }

  queueRedraw () {
    this.needRedraw = true;
  }

  queueTextureUpdate () {
    this.material.map.needsUpdate = true;
  }

  alignNumberToRight (number, size = 6) {
    return number.toString().padStart(size, this.debug ? '_' : ' ');
  }
}
