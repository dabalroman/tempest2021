import readonly from '@/utils/readonly';

export class MessageBroker {
  @readonly
  static TOPIC_AUDIO = 'topic_audio';
  @readonly
  static TOPIC_SCREEN = 'topic_screen';

  @readonly
  static MESSAGE_PLAYER_DEATH = 'message_player_death';
  @readonly
  static MESSAGE_PLAYER_CHANGED_LANE = 'message_player_changed_lane';
  @readonly
  static MESSAGE_NEXT_LEVEL = 'message_next_level';
  @readonly
  static MESSAGE_PLAYER_SHOOT = 'message_player_shoot';
  @readonly
  static MESSAGE_PLAYER_SUPERZAPPER_USED = 'message_player_superzapper_used';
  @readonly
  static MESSAGE_ENEMY_SHOOT = 'message_enemy_shoot';
  @readonly
  static MESSAGE_ENEMY_DEATH = 'message_enemy_death';

  /** {Message[][]} messages */
  messages = [];

  /**
   * @param {string} topic
   * @param {string} message
   * @param {array} context
   */
  publish (topic, message, context = []) {
    if (!(topic in this.messages)) {
      this.messages[topic] = [];
    }

    this.messages[topic].push(new Message(topic, message, context));

    console.log(`Published ${message} under ${topic}`);
  }

  /**
   * @param {string} topic
   * @return {?Message}
   */
  consume (topic) {
    if (!(topic in this.messages)) {
      return null;
    }

    if (this.messages[topic].length === 0) {
      return null;
    }

    console.log(`Consumed ${this.messages[topic][0].message} under ${topic}`);
    return this.messages[topic].shift();
  }
}

export class Message {
  /** {string} */
  topic;
  /** {string} */
  message;
  /** {array} */
  context;

  /**
   * @param {string} topic
   * @param {string} message
   * @param {array} context
   */
  constructor (topic, message, context = []) {
    this.topic = topic;
    this.message = message;
    this.context = context;
  }

  /**
   * @param {string} topic
   * @return {boolean}
   */
  isTopic (topic) {
    return this.topic === topic;
  }

  /**
   * @param {string} message
   * @return {boolean}
   */
  isMessage (message) {
    return this.message === message;
  }
}

const messageBroker = new MessageBroker();
export default messageBroker;
