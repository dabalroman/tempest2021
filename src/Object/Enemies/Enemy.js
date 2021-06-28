import readonly from '@/utils/readonly';
import ShootingSurfaceObject from '@/Object/Surface/ShootingSurfaceObject';
import messageBroker, { MessageBroker } from '@/Helpers/MessageBroker';

export default class Enemy extends ShootingSurfaceObject {
  @readonly
  static SHOOT_TIMEOUT_MS = 100;

  /** @var {number} */
  firstLevel;

  /** @var {number} */
  valueInPoints;

  /** @var {function} */
  rewardCallback;

  /** @var {boolean} */
  reward = false;

  /**
   * @param {Surface} surface
   * @param {ProjectileManager} projectileManager
   * @param {function} rewardCallback
   * @param {number} laneId
   * @param {number} zPosition
   * @param {string} type
   */
  constructor (surface, projectileManager, rewardCallback, laneId, zPosition, type) {
    super(surface, projectileManager, laneId, type);

    this.zPosition = zPosition;

    this.rewardCallback = rewardCallback;
    this.shootTimeoutMs = Enemy.SHOOT_TIMEOUT_MS;

    if (this.constructor === Enemy) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  hitByProjectile () {
    this.reward = true;
    this.die();
  }

  fire () {
    if (super.fire()) {
      messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_ENEMY_SHOOT);
    }
  }

  die () {
    this.hittable = false;
    this.canShoot = false;
    this.clearFlags();

    if (this.reward === true) {
      this.reward = false;
      this.rewardCallback(this.valueInPoints);

      messageBroker.publish(MessageBroker.TOPIC_AUDIO, MessageBroker.MESSAGE_ENEMY_DEATH);
    }
  }
}
