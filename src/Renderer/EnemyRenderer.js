import { BufferGeometry, Group, Line, MeshBasicMaterial, Vector3 } from 'three';
import enemies from '@/maps/Enemies';

export default class EnemyRenderer extends Group {
  /** @var {Enemy} */
  enemy;
  /** @var {BufferGeometry[]} */
  geometry;

  constructor (enemy) {
    super();

    this.enemy = enemy;
    this.loadModel();
  }

  loadModel () {
    this.clear();

    let enemyDataset = enemies.find(x => x.name === this.enemy.type);
    if (enemyDataset === undefined) {
      throw new Error('Unknown enemy: ' + this.enemy.type);
    }

    enemyDataset.coords.forEach((vectorArray, i) => {
      let material = new MeshBasicMaterial({
        color: Array.isArray(enemyDataset.color) ? enemyDataset.color[i] : enemyDataset.color,
      });

      let geometry = new BufferGeometry().setFromPoints([
        ...vectorArray.map(vector2 => new Vector3(vector2.x, vector2.y, 0))
      ]);

      this.add(new Line(geometry, material));
    });
  }
}
