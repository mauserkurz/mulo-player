import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import Control from '@/views/Control/Control.vue';
import TimeLine from '@/views/TimeLine/TimeLine.vue';
import Player from './Player.vue';

const localVue = createLocalVue();

describe('Component Player', () => {
  const defaultProps = { file: 'some-file.mp3' };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(Player, {
      localVue,
      propsData: Object.assign({}, defaultProps, propsData),
      vuetify,
      ...options,
    });

    return { wrapper };
  };
  let originHTMLMediaElement;

  beforeAll(() => {
    originHTMLMediaElement = window.HTMLMediaElement.prototype;

    Object.defineProperties(window.HTMLMediaElement.prototype, {
      readyState: {
        get() {
          return 2;
        },
      },

      duration: {
        get() {
          return 120;
        },
      },

      play: {
        value() {},
      },

      pause: {
        value() {},
      },
    });
  });

  afterAll(() => {
    window.HTMLMediaElement.prototype = originHTMLMediaElement;
  });

  describe('snapshots', () => {
    it('should match snapshot', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should stop playing after click on stop control', () => {
      const { wrapper } = createWrapper({ stubs: { Control } });
      const spy = jest.spyOn(wrapper.vm.audio, 'stop');

      wrapper.findAll(Control).at(0).trigger('click');
      expect(spy).toHaveBeenCalled();
    });

    it('should call pause after click on pause control', () => {
      const { wrapper } = createWrapper({ stubs: { Control } });

      wrapper.findAll(Control).at(1).trigger('click');
      expect(wrapper.vm.audio.playing).toBe(true);
    });

    it('should on rewind event set currentTime', () => {
      const { wrapper } = createWrapper({ stubs: { TimeLine } });

      wrapper.find(TimeLine).vm.$emit('rewind', 0.1);
      expect(wrapper.vm.audio.element.currentTime).toBe(12);
    });

    it('should start download mp3 after click on download control', () => {
      const { wrapper } = createWrapper({ stubs: { Control } });
      const spy = jest.fn();

      window.open = spy;
      wrapper.findAll(Control).at(2).trigger('click');
      expect(spy).toHaveBeenCalledWith('some-file.mp3', '_self');
    });

    it('should toggle element.loop after click on loop control', () => {
      const { wrapper } = createWrapper({ stubs: { Control } });

      wrapper.findAll(Control).at(3).trigger('click');
      expect(wrapper.vm.audio.element.loop).toBe(true);
    });

    it('should mute after click on mute control', () => {
      const { wrapper } = createWrapper({ stubs: { Control } });
      const spy = jest.spyOn(wrapper.vm.audio, 'mute');

      wrapper.findAll(Control).at(4).trigger('click');
      expect(spy).toHaveBeenCalled();
    });

    it('should after hover on volume control change volume using range', () => {
      const { wrapper } = createWrapper({ stubs: { Control } });
      const range = wrapper.find('[type="range"]');

      wrapper.findAll(Control).at(5).trigger('mouseover.native');
      range.element.value = 0.5;
      range.trigger('input');
      expect(wrapper.vm.audio.element.volume).toBe(0.5);
    });
  });
});
