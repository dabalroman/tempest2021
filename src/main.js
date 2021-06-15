import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface/Surface';
import Level from '@/Object/Level';
import LevelRenderer from '@/Renderer/LevelRenderer';
import surfaces from '@/Assets/Surfaces';

import keyboardInput from '@/utils/KeyboardInput';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
//import ScreenPlay from '@/Object/Screen/ScreenPlay';
import ScreenSelectSurface from '@/Object/Screen/ScreenSelectSurface';
//import ScreenHighScores from '@/Object/Screen/ScreenHighScores';

// eslint-disable-next-line no-unused-vars
const scene = new THREE.Scene();
// eslint-disable-next-line no-unused-vars
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// const unrealBloomPass = new UnrealBloomPass({ x: 256, y: 256 }, 2.2, 1.3, 0);
// composer.addPass(unrealBloomPass);
// const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
//
// composer.addPass(smaaPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//NAZWA SURFACE DO WYRENDEROWANIA
let nameOfSurfaceToDisplay = 'Peanut';

const surfacesCollection = Surface.fromDataset(surfaces);
const surfaceToDisplay = surfacesCollection.find(surface => surface.name === nameOfSurfaceToDisplay);

let level, levelRenderer;

//EKRAN DO WYRENDEROWANIA
//const canvas3d = new ScreenPlay(8, 8);
const canvas3d = new ScreenSelectSurface(8, 8);
//const canvas3d = new ScreenHighScores(8, 8);

canvas3d.rotation.y = Math.PI;

if (surfaceToDisplay) {
  level = new Level(surfaceToDisplay);
  levelRenderer = new LevelRenderer(level);

  scene.add(levelRenderer);
  scene.add(canvas3d);
  animate();
} else {
  alert(`BAKA! There is not such surface as ${nameOfSurfaceToDisplay}...`);
}

function animate () {
  requestAnimationFrame(animate);

  controls.update();
  keyboardInput.dispatchActions();

  canvas3d.update();

  level.update();
  levelRenderer.update();

  composer.render();

  //scene.rotation.y = Math.sin(Date.now() % (Math.PI * 2 * 4000) / 4000) / 5;
}


