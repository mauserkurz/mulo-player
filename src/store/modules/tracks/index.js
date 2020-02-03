import api from '@/api/';

export default {
  namespaced: true,

  state: {
    currentTrackID: null,
    trackList: [],
  },

  mutations: {
    SET_TRACK_LIST(state, list) {
      state.trackList = list;
    },

    SET_CURRENT_TRACK_ID(state, ID) {
      state.currentTrackID = ID;
    },
  },

  actions: {
    async getTrackList({ rootState, commit }) {
      const { userID } = rootState.user;
      let response = {};

      try {
        response = await api.getAllTracksInfo({ userID });
      } catch (error) {
        // TODO show 404 warning or error
        window.console.error(error.response);
        return;
      }

      commit('SET_TRACK_LIST', response.data.tracks);
      commit('SET_CURRENT_TRACK_ID', response.data.tracks[0].id);
    },

    getTrack() {},
  },
};
