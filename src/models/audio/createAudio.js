import { DEFAULT_VOLUME } from '@/const';

class AudioAPI {
  #playing = false;

  previousVolume = DEFAULT_VOLUME;

  currentSeconds = 0;

  durationSeconds = 0;


  constructor({ src = '', AudioElement = Audio }) {
    this.element = new AudioElement(src);
    this.element.volume = this.previousVolume;

    this.element.addEventListener('timeupdate', () => {
      this.currentSeconds = this.element.currentTime;
    });

    this.element.addEventListener('loadeddata', () => {
      if (this.element.readyState >= 2) {
        this.durationSeconds = this.element.duration;
      }
      this.switchPlaying(this.#playing);
    });
  }

  get muted() {
    return this.element.volume === 0;
  }

  get playing() {
    return this.#playing;
  }

  switchPlaying(state = !this.#playing) {
    this.#playing = state;

    if (state) {
      this.element.play();
    } else {
      this.element.pause();
    }
  }

  mute() {
    if (this.muted) {
      this.element.volume = this.previousVolume;
    } else {
      this.previousVolume = this.element.volume;
      this.element.volume = 0;
    }
  }

  stop() {
    this.switchPlaying(false);
    this.element.currentTime = 0;
  }
}

export default ({ src, autoPlay }) => new AudioAPI({ src, autoPlay });
