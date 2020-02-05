import api from '@/api/';
import createTrack from '@/models/track/createTrack';

// TODO unit test
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

    track: state => trackID => state.trackList.find(({ id }) => id === trackID),
  },

  mutations: {
    SET_TRACK_LIST(state, list) {
      state.trackList = list;
    },

    SET_CURRENT_TRACK_ID(state, ID) {
      state.currentTrackID = ID;
    },

    SET_AUDIO_BLOB(state, { trackID, blob }) {
      state.trackList.find(({ id }) => id === trackID).blob = blob;
    },
  },

  actions: {
    async getTrackList({ rootState, commit, dispatch }) {
      const { userID } = rootState.user;
      let response = {};

      try {
        response = await api.getAllTracksInfo({ userID });
      } catch (error) {
        // TODO show 404 warning or error
        window.console.error(error.response);
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

      try {
        response = await api.loadTrack({ userID, trackID });
      } catch (error) {
        // TODO show 404 warning or error
        window.console.error(error.response);
        return;
      }
      commit('SET_AUDIO_BLOB', { trackID, blob: response.data });
    },

    async switchTrack({ commit, dispatch }, ID) {
      await dispatch('getTrack', ID);
      commit('SET_CURRENT_TRACK_ID', ID);
    },
  },
};
