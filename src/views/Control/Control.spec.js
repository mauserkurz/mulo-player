import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Control from './Control.vue';

const localVue = createLocalVue();

describe('Component Control', () => {
  const defaultProps = { title: 'Stop', iconName: 'stop' };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(Control, {
      localVue,
      propsData: Object.assign({}, defaultProps, propsData),
      ...options,
    });

    return { wrapper };
  };

  describe('snapshots', () => {
    it('should match snapshot with single icon', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should match snapshot with two icon and showing inactive icon', () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { activeIconName: 'play', isActive: true },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should match snapshot with single icon', () => {
      const { wrapper } = createWrapper();

      wrapper.trigger('click');
      expect(wrapper.emitted().click).toEqual([[]]);
    });
  });
});
