import { BufferGeometry, Group, Line, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import enemies from '@/Assets/Enemies';
import explosions from '@/Assets/Explosions';
import BoundingBox2 from '@/Helpers/BoundingBox2';

export default class SurfaceObjectWrapper extends Group {
  /** @var {SurfaceObject} */
  object;
  /** @var {Surface} */
  surface;

  /** @var {Group} */
  modelGroup;
  /** @var {Group} */
  explosionGroup;

  /** @var {?string} */
  objectType = null;

  /**
   * @param {SurfaceObject} object
   * @param {Surface} surface
   * @param {string} objectType
   */
  constructor (object, surface, objectType) {
    super();

    this.surface = surface;
    this.objectType = objectType;
    this.setObjectRef(object);

    this.clear();
    this.loadModel();

    if (this.object.canExplode) {
      this.loadExplosion();
      this.setVisualsToNormal();
    }

    this.position.set(
      this.surface.lanesMiddleCoords[this.object.laneId].x,
      this.surface.lanesMiddleCoords[this.object.laneId].y,
      this.object.zPosition * this.surface.depth
    );

    this.rotation.z = this.surface.lanesCenterDirectionRadians[this.object.laneId];
  }

  update () {
    if (this.object === null) {
      return;
    }

    this.manageVisibility();
    this.updateState();
    this.move();
    this.rotate();
  }

  manageVisibility () {
    this.visible = this.object.alive;
  }

  /**
   * @param {SurfaceObject} object
   */
  setObjectRef (object) {
    if (this.objectType !== object.type) {
      throw new Error(`Can't render ${object.type} with ${this.objectType}Renderer.`);
    }

    this.object = object;

    this.position.set(
      this.surface.lanesMiddleCoords[this.object.laneId].x,
      this.surface.lanesMiddleCoords[this.object.laneId].y,
      this.object.zPosition * this.surface.depth
    );

    this.rotation.z = this.surface.lanesCenterDirectionRadians[this.object.laneId];
    this.visible = true;

    if (this.modelGroup !== undefined) {
      this.setVisualsToNormal();
    }
  }

  breakObjectRef () {
    this.object = null;
    this.visible = false;
  }

  setVisualsToNormal () {
    throw new Error('Method \'setVisualsToNormal()\' must be implemented.');
  }

  setVisualsToExplode () {
    throw new Error('Method \'setVisualsToExplode()\' must be implemented.');
  }

  updateState () {
    throw new Error('Method \'updateState()\' must be implemented.');
  }

  move () {
    throw new Error('Method \'move()\' must be implemented.');
  }

  rotate () {
    throw new Error('Method \'rotate()\' must be implemented.');
  }

  loadModel () {
    throw new Error('Method \'loadModel()\' must be implemented.');
  }

  loadExplosion () {
    this.explosionGroup = new Group();
    this.explosionGroup.visible = false;

    let isEnemy = enemies.find(enemy => enemy.name === this.object.type) !== undefined;

    let explosionDataset = explosions.find(explosion => explosion.name === (isEnemy ? 'enemy' : 'player'));
    if (explosionDataset === undefined) {
      throw new Error('Unknown explosion: ' + this.object.type);
    }

    let boundingBox2 = BoundingBox2.create([].concat(...explosionDataset.coords));

    explosionDataset.coords.forEach((xyArray, i) => {
      let material = new MeshBasicMaterial({
          color: Array.isArray(explosionDataset.color) ? explosionDataset.color[i] : explosionDataset.color,
        }
      );

      let geometry = new BufferGeometry().setFromPoints(
        xyArray
          .map(xyArray => new Vector2(xyArray.x, xyArray.y))
          .map(vector2 => vector2.sub(boundingBox2.getCenter()))
          .map(vector2 => new Vector3(vector2.x, vector2.y, 0))
      );

      this.explosionGroup.add(new Line(geometry, material));
    });

    this.add(this.explosionGroup);
  }
}
