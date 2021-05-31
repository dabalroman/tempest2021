import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// eslint-disable-next-line no-unused-vars
const scene = new THREE.Scene();
// eslint-disable-next-line no-unused-vars
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( 0, 0, 10 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const points = [];
points.push( new THREE.Vector3( 1, 0, 0 ) );
points.push( new THREE.Vector3( 0, 1, 0 ) );
points.push( new THREE.Vector3( 0, 0, 1 ) );
points.push( new THREE.Vector3( 1, 0, 0 ) );

const lines = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( lines, material );
scene.add( line );

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

animate();
