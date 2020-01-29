import { DEFAULT_VOLUME } from '@/const';

// TODO set default volume as DEFAULT_VOLUME
class AudioAPI {
  #playing = false;

  previousVolume = DEFAULT_VOLUME;

  loaded = false;

  currentSeconds = 0;

  durationSeconds = 0;


  constructor({ autoPlay = false, src = '', AudioElement = Audio } = {}) {
    this.autoPlay = autoPlay;
    this.element = new AudioElement(src);

    this.element.addEventListener('timeupdate', () => {
      this.currentSeconds = this.element.currentTime;
    });

    this.element.addEventListener('loadeddata', () => {
      if (this.element.readyState >= 2) {
        this.loaded = true;
        this.durationSeconds = this.element.duration;
      }
      this.#playing = this.autoPlay;
      return this.#playing;
    });
  }

  get muted() {
    return this.element.volume === 0;
  }

  get playing() {
    return this.#playing;
  }

  set playing(value) {
    this.#playing = value;

    if (value) {
      this.element.play();
    } else {
      this.element.pause();
    }
  }

  mute() {
    if (this.muted) {
      this.element.volume = this.previousVolume;
    }

    this.previousVolume = this.element.volume;
    this.element.volume = 0;
  }

  stop() {
    this.playing = false;
    this.element.currentTime = 0;
  }
}

export default ({ src, autoPlay }) => new AudioAPI({ src, autoPlay });
