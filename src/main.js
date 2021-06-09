import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface';
import LevelContainer from '@/Renderer/LevelContainer';
import surfaces from '@/maps/Surfaces';
import keyboardInput from '@/utils/KeyboardInput';

// eslint-disable-next-line no-unused-vars
const scene = new THREE.Scene();
// eslint-disable-next-line no-unused-vars
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//NAZWA SURFACE DO WYRENDEROWANIA
let nameOfSurfaceToDisplay = 'Box';

const surfacesCollection = Surface.fromDataset(surfaces);
const surfaceToDisplay = surfacesCollection.find(surface => surface.name === nameOfSurfaceToDisplay);

let levelContainer;

if (surfaceToDisplay) {
  levelContainer = new LevelContainer(surfaceToDisplay);
  scene.add(levelContainer);
  animate();
} else {
  alert(`BAKA! There is not such surface as ${nameOfSurfaceToDisplay}...`);
}

function animate () {
  requestAnimationFrame(animate);
  controls.update();
  keyboardInput.dispatchActions();
  levelContainer.update();
  renderer.render(scene, camera);

  scene.rotation.y = Math.sin(Date.now() % (Math.PI * 2 * 4000) / 4000) / 5;
}


