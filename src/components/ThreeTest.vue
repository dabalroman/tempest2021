<template>
  <div id="container"></div>
</template>

<script>
import * as Three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'ThreeTest',

  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      player: null,
      player2: null,
    };
  },

  methods: {
    init: function () {
      let container = document.getElementById('container');

      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 50);
      this.camera.position.z = 10;

      this.controls = new OrbitControls(this.camera, container);
      this.controls.update();

      this.scene = new Three.Scene();
      this.scene.background = new Three.Color(0.2, 0.2, 0.2);

      let objLoader = new OBJLoader();
      let that = this;

      objLoader.load(
          'http://localhost:8080/models/player.obj',
          function (object) {
            that.player = object;

            that.player.traverse(function (child) {
                  if (child.isMesh) {
                    child.material.wireframe = true;
                    var wireframeGeomtry = new Three.WireframeGeometry(child.geometry);
                    var wireframeMaterial = new Three.LineBasicMaterial({ color: 0xffffff });
                    var wireframe = new Three.LineSegments(wireframeGeomtry, wireframeMaterial);
                    child.add(wireframe);
                  }
                }
            );
            that.scene.add(that.player);
          }
      );

      objLoader.load(
          '/models/player.obj',
          function (object) {
            that.player2 = object;
            that.player2.position.set(10, 0, 0);

            that.player2.traverse(function (child) {
                  if (child.isMesh) {
                    child.material.wireframe = false;
                    var wireframeGeomtry = new Three.WireframeGeometry(child.geometry);
                    var wireframeMaterial = new Three.LineBasicMaterial({ color: 0xffffff });
                    var wireframe = new Three.LineSegments(wireframeGeomtry, wireframeMaterial);
                    child.add(wireframe);
                  }
                }
            );
            that.scene.add(that.player2);
          }
      );

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },

    animate: function () {
      requestAnimationFrame(this.animate);
      if(this.player && this.player2) {
        this.player.rotation.x += 0.01;
        this.player.rotation.y += 0.02;
        this.player2.rotation.x += 0.01;
        this.player2.rotation.y += 0.02;
      }
      this.renderer.render(this.scene, this.camera);
    }
  },

  mounted () {
    this.init();
    this.animate();
  }
};
</script>

<style scoped>
#container {
  width: 1280px;
  height: 720px;
  margin: auto;
}
</style>
