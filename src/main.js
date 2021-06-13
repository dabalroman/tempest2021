import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface/Surface';
import Level from '@/Object/Level';
import LevelRenderer from '@/Renderer/LevelRenderer';
import surfaces from '@/maps/Surfaces';

import keyboardInput from '@/utils/KeyboardInput';
import ScreenHighScores from '@/Object/Screen/ScreenHighScores';

// eslint-disable-next-line no-unused-vars
const scene = new THREE.Scene();
// eslint-disable-next-line no-unused-vars
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//NAZWA SURFACE DO WYRENDEROWANIA
let nameOfSurfaceToDisplay = 'Peanut';

const surfacesCollection = Surface.fromDataset(surfaces);
const surfaceToDisplay = surfacesCollection.find(surface => surface.name === nameOfSurfaceToDisplay);

let level, levelRenderer;

//EKRAN DO WYRENDEROWANIA
const canvas3d = new ScreenHighScores(8, 8);
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

  renderer.render(scene, camera);

  scene.rotation.y = Math.sin(Date.now() % (Math.PI * 2 * 4000) / 4000) / 5;
}


