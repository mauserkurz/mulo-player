import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import TimeLine from './TimeLine.vue';

const localVue = createLocalVue();

describe('Component TimeLine', () => {
  const defaultProps = {
    currentSeconds: 112,
    durationSeconds: 4932,
    playing: false,
  };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(TimeLine, {
      localVue,
      propsData: Object.assign({}, defaultProps, propsData),
      ...options,
    });

    return { wrapper };
  };

  describe('snapshots', () => {
    it('should match snapshot', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('event', () => {
    it('should on click over progress bar emit rewind event with position', () => {
      const { wrapper } = createWrapper();

      wrapper.vm.$refs.progress.getBoundingClientRect = () => ({ left: 0, width: 200 });
      wrapper.find('.time-line__progress').trigger('click', { clientX: 20 });
      expect(wrapper.emitted().rewind).toEqual([[0.1]]);
    });
  });
});
