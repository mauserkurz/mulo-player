import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
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
    tracks.actions.getTrackList = () => Promise.resolve();
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
      tracksCopy.actions.getTrackList = () => Promise.resolve();
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call logout action after click on logout button', () => {
      const userCopy = clone(user);
      const spy = jest.fn();

      userCopy.actions.logout = spy;
      const { wrapper } = createWrapper({ modules: { user: userCopy }, isWithoutStubs: true });

      wrapper.find('.player-header').vm.$emit('logout');
      expect(spy).toHaveBeenCalled();
    });

    it('should open drawer after click on cross button', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.player-wrap__footer .v-btn').trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.drawer').vm.value).toBe(true);
    });

    it('should call clearError action on clear-form event from UploadForm', () => {
      const tracksCopy = clone(tracks);
      const spy = jest.fn();

      tracksCopy.actions.clearError = spy;
      tracksCopy.actions.getTrackList = () => Promise.resolve();
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      wrapper.find('.upload-form').vm.$emit('clear-form');
      expect(spy).toHaveBeenCalled();
    });

    it('should call sendFile action on submit event from UploadForm', () => {
      const file = new File([], 'track', { type: 'audio/mpeg' });
      const tracksCopy = clone(tracks);
      const spy = jest.fn();

      tracksCopy.actions.sendFile = spy;
      tracksCopy.actions.getTrackList = () => Promise.resolve();
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      wrapper.find('.upload-form').vm.$emit('submit', file);
      expect(spy).toHaveBeenCalled();
    });

    it('should open drawer after successful file sending', async () => {
      const file = new File([], 'track', { type: 'audio/mpeg' });
      const tracksCopy = clone(tracks);

      tracksCopy.actions.sendFile = () => Promise.resolve(true);
      tracksCopy.actions.getTrackList = () => Promise.resolve();
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      wrapper.find('.upload-form').vm.$emit('submit', file);
      await flushPromises();
      expect(wrapper.find('.drawer').vm.value).toBe(false);
    });

    it('should call cancelGettingTrack action on cancel-getting-track event from TrackList', () => {
      const trackID = 5;
      const tracksCopy = clone(tracks);
      const spy = jest.fn();

      tracksCopy.actions.cancelGettingTrack = spy;
      tracksCopy.actions.getTrackList = () => Promise.resolve();
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      wrapper.find('.track-list').vm.$emit('cancel-getting-track', trackID);
      expect(spy).toHaveBeenCalled();
    });

    it('should call updateTrackList action on update-track-list event from TrackList', () => {
      const tracksCopy = clone(tracks);
      const spy = jest.fn();
      const trackList = [];

      tracksCopy.actions.updateTrackList = spy;
      tracksCopy.actions.getTrackList = () => Promise.resolve();
      const { wrapper } = createWrapper({ modules: { tracks: tracksCopy }, isWithoutStubs: true });

      wrapper.find('.track-list').vm.$emit('update-track-list', trackList);
      expect(spy.mock.calls[0][1]).toEqual(trackList);
    });
  });
});
