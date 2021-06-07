import { BufferGeometry, Group, Line, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import enemies from '@/maps/Enemies';
import BoundingBox2 from '@/Helpers/BoundingBox2';

export default class EnemyRenderer extends Group {
  /** @var {Enemy} */
  enemy;
  /** @var {BufferGeometry[]} */
  geometry;
  /** @var {MeshBasicMaterial[]} */
  materials;
  /** @var {BoundingBox2} */
  boundingBox2;

  constructor (enemy) {
    super();

    this.enemy = enemy;
    this.loadModel();
  }

  loadModel () {
    this.clear();
    this.geometry = [];
    this.materials = [];

    let enemyDataset = enemies.find(x => x.name === this.enemy.type);
    if (enemyDataset === undefined) {
      throw new Error('Unknown enemy: ' + this.enemy.type);
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
