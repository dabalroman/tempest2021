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
import levels from '@/Assets/Levels';

export default class Game {
  @readonly
  static HIGH_SCORES_STORAGE_KEY = 'high_scores';
  @readonly
  static HIGHEST_LEVEL = 'highest_level';

  @readonly
  static STATE_SELECT_SURFACE = new State(0, 0, 'select_surface');
  @readonly
  static STATE_PLAY = new State(0, 0, 'play');
  @readonly
  static STATE_HIGH_SCORES = new State(0, 0, 'high_scores');

  @readonly
  static FLAG_LOAD_NEXT_LEVEL = 0x1;

  /** @var {State} */
  state;
  /** @var {State} */
  prevState;
  /** @var {boolean} */
  screenStateUpdated = false;
  /** @var {number} */
  flags;

  /** @var {number} */
  level = 1;
  /** @var {number} */
  highestLevel = 99;
  /** @var {{id: number, selectable: boolean, scoreBonus: number, targetScore: number}} */
  levelData;
  /** @var {boolean} */
  firstLevel = true;
  /** @var {number} */
  score = 0;
  /** @var {{name: string, score: number}[]} */
  highScores;
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
    this.setState(Game.STATE_SELECT_SURFACE);

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
        this.populateScreenContentManager();
        this.loadScreen(new ScreenSelectSurface(this.screenContentManager));
        this.releaseLevel();

      } else if (this.state.equals(Game.STATE_HIGH_SCORES)) {
        this.loadScreen(new ScreenHighScores(this.screenContentManager));
        this.releaseLevel();

      }

      this.saveGameState();
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
   * @param {boolean} firstLevel
   */
  startLevel (level, firstLevel = false) {
    if (this.levelObject !== null) {
      throw new Error('Can\'t start level while another one is active!');
    }

    this.level = level;
    this.firstLevel = firstLevel;
    this.setState(Game.STATE_PLAY);
  }

  /**
   * @param {number} level
   */
  loadLevel (level) {
    let surfaceId = ((level - 1) % 16) + 1;
    let surface = this.surfacesCollection.find(surface => surface.id === surfaceId);

    if (surface === undefined) {
      this.setState(Game.STATE_SELECT_SURFACE);
      throw new Error(`Can't find surface level with id === ${surfaceId} !`);
    }

    // noinspection JSValidateTypes
    this.levelData = levels.find(levelData => levelData.id === level);

    if (this.levelData === undefined) {
      throw new Error(`Can't find level with id === ${level} !`);
    }

    let targetScore = this.firstLevel
      ? this.levelData.targetScore - this.levelData.scoreBonus
      : this.levelData.targetScore;

    this.levelObject = new Level(
      surface,
      this.level,
      this.score,
      targetScore,
      this.rewardCallback.bind(this),
      this.levelWonCallback.bind(this),
      this.shooterKilledCallback.bind(this),
      this.getCurrentScore.bind(this)
    );

    this.levelObject.registerKeys();

    this.levelRenderer.bindLevel(this.levelObject);
  }

  releaseLevel () {
    if (this.levelObject === null) {
      return;
    }

    this.levelObject.release();
    this.levelObject = null;

    this.levelRenderer.releaseLevel();
  }

  /** @param {Canvas3d} screen */
  loadScreen (screen) {
    if (this.screenObject !== null) {
      this.screenObject.release();
    }

    this.screenObject = screen;
    this.screenGroup.add(this.screenObject);
  }

  releaseScreen () {
    this.screenGroup.remove(this.screenObject);
    this.screenObject = null;
  }

  setupLogic () {
    this.screenContentManager = new ScreenContentManager();

    this.loadGameState();
    this.populateScreenContentManager();

    // noinspection JSCheckFunctionSignatures
    this.surfacesCollection = Surface.fromDataset(surfaces);
  }

  loadGameState () {
    console.log('STATE LOADED');
    this.highScores = new Array(8).fill({ name: 'EZY', score: 16000 });

    let highScores = localStorage.getItem(Game.HIGH_SCORES_STORAGE_KEY);
    if (highScores !== null) {
      highScores = JSON.parse(highScores);

      if (highScores.length === 8) {
        this.highScores = highScores;
      }
    }

    this.highestLevel = 1;
    let highestLevel = localStorage.getItem(Game.HIGHEST_LEVEL);
    if (highestLevel !== null) {
      this.highestLevel = parseInt(highestLevel);
    }
  }

  saveGameState () {
    console.log('STATE SAVED');
    localStorage.setItem(Game.HIGH_SCORES_STORAGE_KEY, JSON.stringify(this.highScores));
    localStorage.setItem(Game.HIGHEST_LEVEL, this.highestLevel.toString());
  }

  populateScreenContentManager () {
    this.screenContentManager.setLives(this.lives);
    this.screenContentManager.setLevel(this.level);
    this.screenContentManager.setScore(this.score);
    this.screenContentManager.setCredits(this.credits);
    this.screenContentManager.setHighScores(this.highScores);
    this.screenContentManager.setSelectActive(0);
    this.screenContentManager.setSelectOffset(0);
    this.screenContentManager.setSelectLevels(
      levels.filter(level => level.selectable && level.id <= this.highestLevel)
    );

    this.screenContentManager.setLevelSelectedCallback(this.startLevel.bind(this));
    this.screenContentManager.setPushHighScoreCallback(this.pushScoreToHighScores.bind(this));
    this.screenContentManager.setCloseHighScoresScreenCallback(() => { this.setState(Game.STATE_SELECT_SURFACE); });
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
    if (this.firstLevel && this.levelData.selectable) {
      this.score += this.levelData.scoreBonus;
    }

    this.firstLevel = false;

    this.releaseLevel();
    this.startLevel(this.level + 1);
  }

  /**
   * @return {boolean} true if game can be continued, false otherwise
   */
  shooterKilledCallback () {
    this.lives--;

    this.screenContentManager.setLives(this.lives);

    if (this.lives === 0) {
      if (this.level > this.highestLevel) {
        this.highestLevel = this.level;
      }

      this.setState(Game.STATE_HIGH_SCORES);
      return false;
    }

    return true;
  }

  /**
   * @param {number} score
   * @param {string} name
   */
  pushScoreToHighScores (score, name) {
    let index = this.highScores.findIndex(row => row.score <= score);

    if (index < 0) {
      return;
    }

    this.highScores.splice(index, 0, { name: name, score: score });
    this.highScores.pop();

    console.log(this.highScores);
  }

  /**
   * @return {number}
   */
  getCurrentScore () {
    return this.score;
  }
}
