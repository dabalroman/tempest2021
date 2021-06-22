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
  /** @var {Vector2} */
  positionOffset = new Vector2();

  /** @var {number} */
  zRotationBase = 0;
  /** @var {number} */
  zRotationOffset = 0;

  /**
   * @var {{
   *  valid: boolean,
   *  continuousRotationUpdate: boolean,
   *  relativeHalfStep: number,
   *  sourceLaneId: number,
   *  targetLaneId: number,
   *  rotationDirection: number
   * }}
   */
  rotatingStateCache = {
    valid: false,
    continuousRotationUpdate: false,
    relativeHalfStep: 0,
    sourceLaneId: 0,
    targetLaneId: 0,
    rotationDirection: 0
  };

  /**
   * @param {Enemy} enemy
   * @param {Surface} surface
   * @param {string} enemyType
   */
  constructor (enemy, surface, enemyType) {
    super(enemy, surface, enemyType);

    this.setLaneOffset();
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
    this.position.set(
      this.positionBase.x + this.positionOffset.x,
      this.positionBase.y + this.positionOffset.y,
      this.object.zPosition * this.surface.depth
    );
  }

  rotate () {
    this.rotation.z = this.zRotationBase + this.zRotationOffset;
  }

  setLaneOffset (offset = 0.5) {
    let laneCoords = this.surface.lanesCoords[this.object.laneId].clone();
    let laneCenterCoords = this.surface.lanesMiddleCoords[this.object.laneId].clone();

    let scalar = (offset - 0.5) * 2;
    laneCenterCoords.sub(laneCoords).multiplyScalar(scalar);

    this.positionOffset = laneCenterCoords;
  }

  /**
   * @param {number} rotationDirection 1 for CCW, -1 for CW
   */
  calculateRotationStateCacheVariables (rotationDirection) {
    this.rotatingStateCache.rotationDirection = rotationDirection;

    this.rotatingStateCache.sourceLaneId = this.object.laneId;
    this.rotatingStateCache.targetLaneId = this.surface.getActualLaneIdFromProjectedMovement(
      this.object.laneId + this.rotatingStateCache.rotationDirection
    );

    let currentLaneRotation = this.surface.lanesCenterDirectionRadians[this.rotatingStateCache.sourceLaneId];
    let targetLaneRotation = this.surface.lanesCenterDirectionRadians[this.rotatingStateCache.targetLaneId];
    let targetRealRotation = (targetLaneRotation + Math.PI) % (Math.PI * 2);

    let relativeStep;
    if (this.rotatingStateCache.rotationDirection === 1) {
      if (currentLaneRotation > targetRealRotation) {
        relativeStep = currentLaneRotation - targetRealRotation;
      } else {
        relativeStep = currentLaneRotation + (Math.PI * 2 - targetRealRotation);
      }
    } else {
      if (currentLaneRotation > targetRealRotation) {
        relativeStep = (Math.PI * 2 - currentLaneRotation) + targetRealRotation;
      } else {
        relativeStep = targetRealRotation - currentLaneRotation;
      }
    }

    this.rotatingStateCache.relativeHalfStep = relativeStep / 2;
    this.rotatingStateCache.valid = true;
  }

  invalidateRotationStateCache () {
    this.rotatingStateCache.valid = false;
  }

  isRotationStateCacheValid () {
    return this.rotatingStateCache.valid;
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

