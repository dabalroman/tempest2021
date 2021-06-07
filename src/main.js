import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Surface from '@/Object/Surface';
import SurfaceRenderer from '@/Renderer/SurfaceRenderer';

import surfaces from '@/maps/Surfaces';
import ShooterRenderer from '@/Renderer/ShooterRenderer';

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
let surfaceRenderer = null;

if (surfaceToDisplay) {
  surfaceRenderer = new SurfaceRenderer(surfaceToDisplay);
  scene.add(surfaceRenderer);
}

const shooterRenderer = ShooterRenderer.create();
scene.add(shooterRenderer);

function animate () {
  requestAnimationFrame(animate);
  controls.update();
  surfaceRenderer.update();
  renderer.render(scene, camera);

  if (surfaceToDisplay) {
    scene.rotation.z += 0.001;
  }
}

animate();
