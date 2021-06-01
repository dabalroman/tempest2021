import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';

import surfaces from '@/maps/Surfaces';

// eslint-disable-next-line no-unused-vars
const scene = new THREE.Scene();
// eslint-disable-next-line no-unused-vars
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-5, 5, -5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//NAZWA SURFACE DO WYRENDEROWANIA
let nameOfSurfaceToDisplay = 'Loop';

const surfacesCollection = Surface.fromDataset(surfaces);
const surfaceToDisplay = surfacesCollection.find(surface => surface.name === nameOfSurfaceToDisplay);
let surfaceRenderer = null;

if (surfaceToDisplay) {
  surfaceRenderer = new SurfaceRenderer(surfaceToDisplay);
  scene.add(surfaceRenderer);
}

function animate () {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  if (surfaceToDisplay) {
    surfaceRenderer.rotation.z += 0.01;
  }
}

animate();
