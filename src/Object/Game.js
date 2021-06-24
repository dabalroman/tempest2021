import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import ScreenPlay from '@/Object/Screen/ScreenPlay';
import keyboardInput from '@/utils/KeyboardInput';
import LevelRenderer from '@/Renderer/LevelRenderer';
import Level from '@/Object/Level';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface/Surface';
import surfaces from '@/Assets/Surfaces';

export default class Game {
  /** @var {number} */
  levelCounter = 1;
  /** @var {number} */
  score = 0;
  /** @var {number} */
  lives = 0;
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
  /** @var {Canvas3d} */
  canvas3d = null;

  constructor () {
    this.setupRenderer();
    this.setupLogic();
  }

  loadLevel (surface) {
    this.levelObject = new Level(surface, this.rewardCallback.bind(this));
    this.levelObject.registerKeys();

    this.levelRenderer.bindLevel(this.levelObject);
  }

  releaseLevel () {
    this.levelObject.release();
    this.levelObject = null;

    this.levelRenderer.releaseLevel();
  }

  setupLogic () {
    this.surfacesCollection = Surface.fromDataset(surfaces);
    this.loadLevel(this.surfacesCollection.find(surface => surface.name === 'Peanut'));
  }

  setupRenderer () {
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, -6);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.levelRenderer = new LevelRenderer();
    this.scene.add(this.levelRenderer);

    this.canvas3d = new ScreenPlay(8, 8);
    this.canvas3d.rotation.y = Math.PI;
    this.scene.add(this.canvas3d);
  }

  update () {
    requestAnimationFrame(this.update.bind(this));

    this.controls.update();
    keyboardInput.dispatchActions();

    if (this.canvas3d !== null) {
      this.canvas3d.update();
    }

    if (this.levelObject !== null && this.levelRenderer !== null) {
      this.levelObject.update();
      this.levelRenderer.update();
    }

    this.composer.render();
  }

  rewardCallback (reward) {
    this.score += reward;

    // noinspection JSUnresolvedFunction
    this.canvas3d.setScore(this.score);
  }
}
