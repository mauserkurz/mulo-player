import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import PlayerWrap from './PlayerWrap.vue';

const localVue = createLocalVue();

describe('Component PlayerWrap', () => {
  const createWrapper = ({ isWithoutStubs = false, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(PlayerWrap, {
      localVue,
      vuetify,
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
});
