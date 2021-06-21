import EnemyRenderer from '@/Renderer/Enemies/EnemyRenderer';
import Enemy from '@/Object/Enemies/Enemy';
import readonly from '@/utils/readonly';
import { BufferGeometry, Line, MeshBasicMaterial, Vector3 } from 'three';

export default class EnemySpikeRenderer extends EnemyRenderer {
  @readonly
  static SPIKE_COLOR = 0x00ff00;

  /**
   * @param {EnemySpike} enemySpike
   * @param {Surface} surface
   */
  constructor (enemySpike, surface) {
    super(enemySpike, surface, Enemy.TYPE_SPIKE);
  }

  updatePosition () {
    // noinspection JSUnresolvedFunction
    if (this.object.shouldRerenderSpikeDueToSpikeLengthChange()) {
      this.updateModel();
    }

    this.positionBase = this.surface.lanesMiddleCoords[this.object.laneId].clone();
    this.zRotationBase = this.surface.lanesCenterDirectionRadians[this.object.laneId];
  }

  updateModel () {
    this.children[0].geometry =
      new BufferGeometry().setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0, (1 - this.object.zPosition) * this.surface.depth)
      ]);
  }

  loadModel () {
    this.clear();
    this.geometry = [];
    this.materials = [];

    this.materials.push(
      new MeshBasicMaterial({
        color: EnemySpikeRenderer.SPIKE_COLOR,
      })
    );

    this.geometry.push(
      new BufferGeometry().setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0, (1 - this.object.zPosition) * this.surface.depth)
      ])
    );

    this.add(new Line(this.geometry[0], this.materials[0]));
  }
}
