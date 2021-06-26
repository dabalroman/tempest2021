import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import ScreenPlay from '@/Object/Screen/ScreenPlay';
import keyboardInput from '@/utils/KeyboardInput';
import LevelRenderer from '@/Renderer/LevelRenderer';
import Level from '@/Object/Level';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface/Surface';
import surfaces from '@/Assets/Surfaces';
import readonly from '@/utils/readonly';
import State from '@/Object/State';
import ScreenSelectSurface from '@/Object/Screen/ScreenSelectSurface';
import ScreenHighScores from '@/Object/Screen/ScreenHighScores';
import ScreenContentManager from '@/Object/Screen/ScreenContentManager';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

export default class Game {
  @readonly
  static STATE_SELECT_SURFACE = new State(0, 0, 'select_surface');
  @readonly
  static STATE_PLAY = new State(0, 0, 'play');
  @readonly
  static STATE_HIGH_SCORES = new State(0, 0, 'high_scores');

  /** @var {State} */
  state;
  /** @var {State} */
  prevState;
  /** @var {boolean} */
  screenStateUpdated = false;

  /** @var {number} */
  level = 1;
  /** @var {number} */
  score = 0;
  /** @var {number} */
  lives = 5;
  /** @var {number} */
  credits = 1;

  /** @var {Scene} */
  scene;
  /** @var {PerspectiveCamera} */
  camera;
  /** @var {WebGLRenderer} */
  renderer;
  /** @var {EffectComposer} */
  composer;
  /** @var {OrbitControls} */
  controls;
  /** @var {Level} */
  levelObject = null;
  /** @var {LevelRenderer} */
  levelRenderer = null;

  /** @var {Group} */
  screenGroup;
  /** @var {Canvas3d} */
  screenObject = null;
  /** @var {ScreenContentManager} */
  screenContentManager;

  constructor () {
    this.setState(Game.STATE_PLAY);

    this.setupRenderer();
    this.setupLogic();
  }

  handleState () {
    if (!this.screenStateUpdated) {
      this.releaseScreen();

      if (this.state.equals(Game.STATE_PLAY)) {
        this.loadScreen(new ScreenPlay(this.screenContentManager));
        this.loadLevel(this.level);
        this.screenContentManager.setLevel(this.level);

      } else if (this.state.equals(Game.STATE_SELECT_SURFACE)) {
        this.loadScreen(new ScreenSelectSurface(this.screenContentManager));
        this.releaseLevel();

      } else if (this.state.equals(Game.STATE_HIGH_SCORES)) {
        this.loadScreen(new ScreenHighScores(this.screenContentManager));
        this.releaseLevel();

      }
    }

    this.screenStateUpdated = true;
  }

  /**
   * @param {State} state
   */
  setState (state) {
    this.prevState = this.state;
    this.state = state;
    this.screenStateUpdated = false;
  }

  /**
   * @param {number} level
   */
  loadLevel (level) {
    let surfaceId = ((level - 1) % 16) + 1;
    let surface = this.surfacesCollection.find(surface => surface.id === surfaceId);
    this.levelObject = new Level(
      surface,
      this.rewardCallback.bind(this),
      this.levelWonCallback.bind(this),
      this.shooterKilledCallback.bind(this)
    );
    this.levelObject.registerKeys();

    this.levelRenderer.bindLevel(this.levelObject);
  }

  releaseLevel () {
    this.levelObject.release();
    this.levelObject = null;

    this.levelRenderer.releaseLevel();
  }

  /** @param {Canvas3d} screen */
  loadScreen (screen) {
    this.screenObject = screen;
    this.screenGroup.add(this.screenObject);
  }

  releaseScreen () {
    this.screenGroup.remove(this.screenObject);
    this.screenObject = null;
  }

  setupLogic () {
    this.screenContentManager = new ScreenContentManager();
    this.surfacesCollection = Surface.fromDataset(surfaces);
  }

  setupRenderer (highQuality = true) {
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, -6);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    if (highQuality) {
      this.composer.addPass(new UnrealBloomPass({ x: 256, y: 256 }, 2.2, 1.3, 0));
      this.composer.addPass(new SMAAPass(window.innerWidth, window.innerHeight));
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.levelRenderer = new LevelRenderer();
    this.scene.add(this.levelRenderer);

    this.screenGroup = new Group();
    this.screenGroup.rotation.y = Math.PI;
    this.scene.add(this.screenGroup);
  }

  update () {
    requestAnimationFrame(this.update.bind(this));

    this.handleState();

    this.controls.update();
    keyboardInput.dispatchActions();

    if (this.screenObject !== null) {
      this.screenObject.update();
    }

    if (this.levelObject !== null && this.levelRenderer !== null) {
      this.levelObject.update();
      this.levelRenderer.update();
    }

    this.composer.render();
  }

  rewardCallback (reward) {
    this.score += reward;

    this.screenContentManager.setScore(this.score);
  }

  levelWonCallback () {

  }

  shooterKilledCallback () {
    this.lives--;

    this.screenContentManager.setLives(this.lives);

    if (this.lives === 0) {
      this.setState(Game.STATE_HIGH_SCORES);
    }
  }
}
