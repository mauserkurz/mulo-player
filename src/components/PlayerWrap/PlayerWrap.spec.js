import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import vuetify from '@/plugins/vuetify';
import user from '@/store/modules/user/';
import tracks from '@/store/modules/tracks/';
import PlayerWrap from './PlayerWrap.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Component PlayerWrap', () => {
  const createWrapper = ({ isWithoutStubs = false, modules = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const store = new Vuex.Store({
      namespaced: true,

      modules: Object.assign({ user, tracks }, modules),
    });
    const wrapper = renderer(PlayerWrap, {
      localVue,
      vuetify,
      store,
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
