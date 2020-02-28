import axios from 'axios';
import { API_ERROR_MAP } from '@/constants';
import utils from '@/utils';
import api from '@/api/';
import createTrack from '@/models/track/createTrack';

const findTrack = state => trackID => state.trackList.find(({ id }) => id === trackID);

export default {
  namespaced: true,

  state: {
    currentTrackID: null,
    trackList: [],
    sendingFileError: '',
    isFileSending: false,
    loadTrackCancelSourceMap: {},
  },

  getters: {
    currentTrack(state, getters) {
      if (state.currentTrackID === null) {
        return {};
      }
      return getters.track(state.currentTrackID);
    },

    loadTrackCancelSourceMap: state => trackID => state.loadTrackCancelSourceMap[trackID],

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

    ADD_TRACK_TO_LIST(state, { id, name, blob }) {
      state.trackList.push(createTrack({ id, name, blob }));
    },

    SET_SENDING_FILE_ERROR(state, error) {
      state.sendingFileError = error;
    },

    SET_IS_FILE_SENDING(state, mode) {
      state.isFileSending = mode;
    },

    ADD_LOAD_TRACK_CANCEL_SOURCE(state, { trackID, source }) {
      state.loadTrackCancelSourceMap[trackID] = source;
    },

    DELETE_LOAD_TRACK_CANCEL_SOURCE(state, trackID) {
      delete state.loadTrackCancelSourceMap[trackID];
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
      } else {
        commit('SET_TRACK_LIST', []);
        commit('SET_CURRENT_TRACK_ID', null);
      }
    },

    async getTrack({ rootState, getters, commit }, trackID) {
      const { userID } = rootState.user;
      const source = axios.CancelToken.source();

      if (getters.track(trackID).blob) {
        return;
      }
      let response = {};

      commit('SET_TRACK_LOADING_STATE', { trackID, isLoading: true });
      commit('ADD_LOAD_TRACK_CANCEL_SOURCE', { trackID, source });
      try {
        response = await api.loadTrack({ userID, trackID, cancelToken: source.token });
      } catch (error) {
        if (error.message !== API_ERROR_MAP.CANCELED_BY_USER) {
          window.console.error(error);
        }
        return;
      } finally {
        commit('DELETE_LOAD_TRACK_CANCEL_SOURCE', trackID);
        commit('SET_TRACK_LOADING_STATE', { trackID, isLoading: false });
      }
      commit('SET_AUDIO_BLOB', { trackID, blob: response.data });
    },

    cancelGettingTrack({ getters, commit }, trackID) {
      const source = getters.loadTrackCancelSourceMap(trackID);

      source.cancel(API_ERROR_MAP.CANCELED_BY_USER);
      commit('SET_TRACK_LOADING_STATE', { trackID, isLoading: false });
    },

    async switchTrack({ commit, dispatch }, ID) {
      await dispatch('getTrack', ID);
      commit('SET_CURRENT_TRACK_ID', ID);
    },

    async sendFile({ rootState, commit }, file) {
      const { userID } = rootState.user;
      let response;

      commit('SET_IS_FILE_SENDING', true);
      try {
        response = await api.sendTrack({ userID, file });
      } catch (error) {
        commit('SET_SENDING_FILE_ERROR', utils.createMessage(error));
        return false;
      } finally {
        commit('SET_IS_FILE_SENDING', false);
      }
      const { id, name } = response.data.tracks[0];

      commit('ADD_TRACK_TO_LIST', { id, name, blob: file });
      commit('SET_SENDING_FILE_ERROR', '');
      return true;
    },
  },
};
