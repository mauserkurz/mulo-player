import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import Drawer from './Drawer.vue';

const localVue = createLocalVue();

describe('Component Drawer', () => {
  const defaultProps = { value: true };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(Drawer, {
      localVue,
      vuetify,
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

  describe('events', () => {
    it('should emit input event after click on close button', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-btn').trigger('click');
      expect(wrapper.emitted().input).toEqual([[true], [false]]);
    });
  });
});
