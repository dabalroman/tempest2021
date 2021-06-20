import { BufferGeometry, Line, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import SurfaceObjectWrapper from '@/Renderer/Surface/SurfaceObjectWrapper';
import enemies from '@/Assets/Enemies';
import BoundingBox2 from '@/Helpers/BoundingBox2';

export default class EnemyRenderer extends SurfaceObjectWrapper {
  /** @var {BufferGeometry[]} */
  geometry;
  /** @var {MeshBasicMaterial[]} */
  materials;
  /** @var {BoundingBox2} */
  boundingBox2;

  /** @var {Vector2} */
  positionBase = new Vector2();

  /** @var {number} */
  zRotationBase = 0;
  /** @var {number} */
  zRotationOffset = 0;

  /**
   * @param {Enemy} enemy
   * @param {Surface} surface
   * @param {string} enemyType
   */
  constructor (enemy, surface, enemyType) {
    super(enemy, surface, enemyType);
  }

  setObjectRef (object) {
    if (object.type !== this.objectType) {
      throw new Error(`Can't associate ${object.type} with ${this.objectType} renderer`);
    }

    super.setObjectRef(object);
  }

  update () {
    if (this.object === null) {
      return;
    }

    this.manageVisibility();
    this.updatePosition();
    this.move();
    this.rotate();
  }

  updatePosition () {
    throw new Error('Method \'updatePosition()\' must be implemented.');
  }

  move () {
    this.position.set(this.positionBase.x, this.positionBase.y, this.object.zPosition * this.surface.depth);
  }

  rotate () {
    this.rotation.z = this.zRotationBase + this.zRotationOffset;
  }

  loadModel () {
    this.clear();
    this.geometry = [];
    this.materials = [];

    let enemyDataset = enemies.find(enemy => enemy.name === this.object.type);
    if (enemyDataset === undefined) {
      throw new Error('Unknown object: ' + this.object.type);
    }

    this.boundingBox2 = BoundingBox2.create([].concat(...enemyDataset.coords));

    enemyDataset.coords.forEach((xyArray, i) => {
      this.materials.push(
        new MeshBasicMaterial({
          color: Array.isArray(enemyDataset.color) ? enemyDataset.color[i] : enemyDataset.color,
        })
      );

      this.geometry.push(
        new BufferGeometry().setFromPoints(
          xyArray
            .map(xyArray => new Vector2(xyArray.x, xyArray.y))
            .map(vector2 => vector2.sub(this.boundingBox2.getCenter()))
            .map(vector2 => new Vector3(vector2.x, vector2.y, 0))
        )
      );

      this.add(new Line(this.geometry[i], this.materials[i]));
    });

    if (enemyDataset.scale) {
      this.scale.set(enemyDataset.scale.x, enemyDataset.scale.y, enemyDataset.scale.z);
    }
  }
}

