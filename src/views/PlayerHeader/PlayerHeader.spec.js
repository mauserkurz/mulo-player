import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import PlayerHeader from './PlayerHeader.vue';

const localVue = createLocalVue();

describe('Component PlayerHeader', () => {
  const createWrapper = ({ isWithoutStubs = false, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(PlayerHeader, {
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

  describe('events', () => {
    it('should emit logout event after click on logout button', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-btn').trigger('click');
      expect(wrapper.emitted().logout).toEqual([[]]);
    });
  });
});
