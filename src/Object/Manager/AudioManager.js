import { Audio, AudioLoader } from 'three';
import readonly from '@/utils/readonly';
import messageBroker, { MessageBroker } from '@/Helpers/MessageBroker';

export default class AudioManager {
  @readonly
  static SOUND_ENEMY_DEATH = 'enemy_death';
  @readonly
  static SOUND_NEXT_LEVEL = 'next_level';
  @readonly
  static SOUND_PLAYER_DEATH = 'player_death';
  @readonly
  static SOUND_PLAYER_LANE_CHANGE = 'player_lane_change';
  @readonly
  static SOUND_PLAYER_SHOOT = 'player_shoot';

  @readonly
  static SOUND_VOLUME = 0.4;

  /** {AudioListener} */
  audioListener;
  /** {Audio[]} */
  audio = [];
  /** {AudioBuffer[][]} */
  audioBuffer;

  constructor (audioListener) {
    this.audioListener = audioListener;
    this.audio.push(new Audio(this.audioListener));
  }

  playSound (soundName, volume = 1) {
    let availableAudio = this.audio.find(audio => !audio.isPlaying);

    if (availableAudio === undefined) {
      this.audio.push(new Audio(this.audioListener));
      availableAudio = this.audio[this.audio.length - 1];
    }

    const audioLoader = new AudioLoader();
    audioLoader.load(`sounds/${soundName}.ogg`, buffer => {
      availableAudio.setBuffer(buffer);
      availableAudio.setVolume(volume * AudioManager.SOUND_VOLUME);
      availableAudio.play();
    });
  }

  update () {
    let message = messageBroker.consume(MessageBroker.TOPIC_AUDIO);

    if (message === null) {
      return;
    }

    switch (message.message) {
      case MessageBroker.MESSAGE_ENEMY_DEATH:
        this.playSound(AudioManager.SOUND_ENEMY_DEATH);
        break;
      case MessageBroker.MESSAGE_PLAYER_DEATH:
        this.playSound(AudioManager.SOUND_PLAYER_DEATH);
        break;
      case MessageBroker.MESSAGE_PLAYER_CHANGED_LANE:
        this.playSound(AudioManager.SOUND_PLAYER_LANE_CHANGE);
        break;
      case MessageBroker.MESSAGE_NEXT_LEVEL:
        this.playSound(AudioManager.SOUND_NEXT_LEVEL);
        break;
      case MessageBroker.MESSAGE_PLAYER_SHOOT:
        this.playSound(AudioManager.SOUND_PLAYER_SHOOT, 0.8);
        break;
      case MessageBroker.MESSAGE_ENEMY_SHOOT:
        this.playSound(AudioManager.SOUND_PLAYER_SHOOT, 0.3);
        break;
      case MessageBroker.MESSAGE_MENU_CHANGE:
        this.playSound(AudioManager.SOUND_PLAYER_LANE_CHANGE);
        break;
      case MessageBroker.MESSAGE_MENU_SELECT:
        this.playSound(AudioManager.SOUND_PLAYER_SHOOT, 0.8);
        break;
    }
  }
}
