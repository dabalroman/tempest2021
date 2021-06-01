import { BufferGeometry, Line, MeshBasicMaterial, Vector3 } from 'three';

export default class LaneRenderer extends Line {
  type = 'lane';

  /** @var {Surface} surface */
  surface;
  /** @var {number} depth */
  depth = 10;

  /**
   * @constructor
   * @param {Vector2} nodeA
   * @param {Vector2} nodeB
   * @param {number} depth
   */
  constructor (nodeA, nodeB, depth = 1) {
    super();

    this.setDepth(depth);
    this.setNodes(nodeA, nodeB);
    this.setMaterial(0xff0000);

    this.castShadow = false;
  }

  /**
   * @param {Vector2} nodeA
   * @param {Vector2} nodeB
   */
  setNodes (nodeA, nodeB) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;

    this.createGeometry();
  }

  /**
   * @param {number} depth
   */
  setDepth (depth) {
    this.depth = depth;
  }

  createGeometry () {
    this.geometry = new BufferGeometry().setFromPoints([
      new Vector3(this.nodeA.x, this.nodeA.y, 0),
      new Vector3(this.nodeA.x, this.nodeA.y, this.depth),
      new Vector3(this.nodeB.x, this.nodeB.y, this.depth),
      new Vector3(this.nodeB.x, this.nodeB.y, 0),
      new Vector3(this.nodeA.x, this.nodeA.y, 0)
    ]);
  }

  /**
   * @param {number} color
   */
  setMaterial (color) {
    this.material = new MeshBasicMaterial({
      color: color,
    });
  }
}
