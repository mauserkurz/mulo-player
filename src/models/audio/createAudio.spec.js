import createAudio from './createAudio';

describe('Model audio', () => {
  const map = {};
  let originHTMLMediaElement;

  beforeAll(() => {
    originHTMLMediaElement = window.HTMLMediaElement.prototype;

    Object.defineProperties(window.HTMLMediaElement.prototype, {
      readyState: {
        get() {
          return 2;
        },
      },

      play: {
        value() {},
      },

      pause: {
        value() {},
      },

      addEventListener: {
        value(event, callback) {
          map[event] = callback;
        },
      },
    });
  });

  afterAll(() => {
    window.HTMLMediaElement.prototype = originHTMLMediaElement;
  });

  describe('method mute', () => {
    it('should set audio.volume to 0', () => {
      const audio = createAudio({});

      audio.mute();
      expect(audio.element.volume).toBe(0);
    });

    it('should set volume property to 0', () => {
      const audio = createAudio({});

      audio.mute();
      expect(audio.element.volume).toBe(0);
    });

    it('should be muted after call', () => {
      const audio = createAudio({});

      audio.mute();
      expect(audio.muted).toBe(true);
    });

    it('should restore audio.volume to 0.35 after second call', () => {
      const audio = createAudio({});

      audio.mute();
      expect(audio.element.volume).toBe(0);
      audio.mute();
      expect(audio.element.volume).toBe(0.35);
    });

    it('should be not muted after second call', () => {
      const audio = createAudio({});

      audio.mute();
      audio.mute();
      expect(!audio.muted).toBe(true);
    });
  });

  describe('method stop', () => {
    it('should call audio.pause', () => {
      const audio = createAudio({});

      audio.element.pause = jest.fn();
      audio.stop();
      expect(audio.element.pause).toHaveBeenCalled();
    });

    it('should set audio.currentTime to 0', () => {
      const audio = createAudio({});

      audio.element.currentTime = 10;
      audio.stop();
      expect(audio.element.currentTime).toBe(0);
    });

    it('should set playing to false', () => {
      const audio = createAudio({});

      audio.switchPlaying(true);
      audio.stop();
      expect(audio.playing).toBe(false);
    });
  });

  describe('method switchPlaying', () => {
    it('should call audio.play with true state', () => {
      const audio = createAudio({});

      audio.element.play = jest.fn();
      audio.switchPlaying(true);
      expect(audio.element.play).toHaveBeenCalled();
    });

    it('should don`t call audio.play with true state and src with empty blob', () => {
      const audio = createAudio({});

      audio.element.src = window.location.href;
      audio.element.play = jest.fn();
      audio.switchPlaying(true);
      expect(audio.element.play).not.toHaveBeenCalled();
    });

    it('should call audio.pause with false state', () => {
      const audio = createAudio({});

      audio.element.pause = jest.fn();
      audio.switchPlaying(false);
      expect(audio.element.pause).toHaveBeenCalled();
    });

    it('should not call audio.pause right after audio.play call', () => {
      const audio = createAudio({});

      audio.element.play = () => new Promise(resolve => setTimeout(resolve), 1000);
      audio.element.pause = jest.fn();
      audio.switchPlaying(true);
      audio.switchPlaying(false);
      expect(audio.element.pause).not.toHaveBeenCalled();
    });
  });

  describe('audio events', () => {
    it('should on timeupdate event set currentSeconds', () => {
      const currentTime = 300;
      const audio = createAudio({});

      audio.element.currentTime = currentTime;
      map.timeupdate();
      expect(audio.currentSeconds).toBe(currentTime);
    });

    it('should on loadeddata event after switchPlaying call play track', () => {
      const audio = createAudio({});
      const spy = jest.spyOn(audio.element, 'play');

      audio.switchPlaying(true);
      map.loadeddata();
      expect(spy).toHaveBeenCalled();
    });
  });
});
