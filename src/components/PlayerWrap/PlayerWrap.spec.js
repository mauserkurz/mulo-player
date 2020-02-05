import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import clone from 'ramda/src/clone';
import Vuex from 'vuex';
import vuetify from '@/plugins/vuetify';
import user from '@/store/modules/user/';
import tracks from '@/store/modules/tracks/';
import createTrack from '@/models/track/createTrack';
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
      const tracksCopy = clone(tracks);

      tracksCopy.state.trackList = [
        createTrack({
          id: 0,
          name: 'Band 0 - Song 0',
          isLoading: true,
        }),
        createTrack({
          id: 1,
          name: 'Band 1 - Song 1',
          blob: new Blob([], { type: 'audio/mpeg' }),
        }),
        createTrack({
          id: 2,
          name: 'Band 2 - Song 2',
        }),
      ];
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
