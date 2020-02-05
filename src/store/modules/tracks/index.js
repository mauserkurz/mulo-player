import api from '@/api/';
import createTrack from '@/models/track/createTrack';

const findTrack = state => trackID => state.trackList.find(({ id }) => id === trackID);

export default {
  namespaced: true,

  state: {
    currentTrackID: null,
    trackList: [],
  },

  getters: {
    currentTrack(state, getters) {
      if (state.currentTrackID === null) {
        return {};
      }
      return getters.track(state.currentTrackID);
    },

    track: findTrack,
  },

  mutations: {
    SET_TRACK_LIST(state, list) {
      state.trackList = list;
    },

    SET_CURRENT_TRACK_ID(state, trackID) {
      state.currentTrackID = trackID;
    },

    SET_AUDIO_BLOB(state, { trackID, blob }) {
      findTrack(state)(trackID).blob = blob;
    },

    SET_TRACK_LOADING_STATE(state, { trackID, isLoading }) {
      findTrack(state)(trackID).isLoading = isLoading;
    },
  },

  actions: {
    async getTrackList({ rootState, commit, dispatch }) {
      const { userID } = rootState.user;
      let response = {};

      try {
        response = await api.getAllTracksInfo({ userID });
      } catch (error) {
        window.console.error(error);
        return;
      }
      const { tracks } = response.data;

      if (tracks.length > 0) {
        commit('SET_TRACK_LIST', tracks.map(createTrack));
        await dispatch('switchTrack', response.data.tracks[0].id);
      }
    },

    async getTrack({ rootState, getters, commit }, trackID) {
      const { userID } = rootState.user;

      if (getters.track(trackID).blob) {
        return;
      }
      let response = {};

      commit('SET_TRACK_LOADING_STATE', { trackID, isLoading: true });
      try {
        response = await api.loadTrack({ userID, trackID });
      } catch (error) {
        window.console.error(error);
        return;
      } finally {
        commit('SET_TRACK_LOADING_STATE', { trackID, isLoading: false });
      }
      commit('SET_AUDIO_BLOB', { trackID, blob: response.data });
    },

    async switchTrack({ commit, dispatch }, ID) {
      await dispatch('getTrack', ID);
      commit('SET_CURRENT_TRACK_ID', ID);
    },
  },
};
