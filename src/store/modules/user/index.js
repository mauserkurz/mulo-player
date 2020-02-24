import { path, pathOr } from 'ramda';
import utils from '@/utils';
import api from '@/api/';
import router from '@/router';
import { AUTH_FORM_TYPE_MAP, STATUS_MAP, API_ERROR_MAP } from '@/const';

const getErrorKey = response => pathOr([], ['data', 'errors', 0, 'message'], response);

export default {
  namespaced: true,

  state: {
    userID: '',
    login: '',
    error: '',
    isAuthLoading: false,
    isUserDataLoading: false,
    isLogoutProcessing: false,
  },

  getters: {
    isAuthorized(state) {
      return !!state.userID;
    },
  },

  mutations: {
    SET_USER_ID(state, id) {
      state.userID = id;
    },

    SET_LOGIN(state, login) {
      state.login = login;
    },

    SET_AUTH_ERROR(state, error) {
      state.error = error;
    },

    SET_IS_AUTH_LOADING(state, mode) {
      state.isAuthLoading = mode;
    },

    SET_IS_USER_DATE_LOADING(state, mode) {
      state.isUserDataLoading = mode;
    },

    SET_IS_LOGOUT_PROCESSING(state, mode) {
      state.isLogoutProcessing = mode;
    },
  },

  actions: {
    setUser({ commit }, data) {
      commit('SET_USER_ID', data.user_id);
      commit('SET_LOGIN', data.login);
      router.push({ path: 'player' });
    },

    async auth({ commit, dispatch }, { login, password, type }) {
      const methodMap = {
        [AUTH_FORM_TYPE_MAP.SIGN_IN]: 'signIn',
        [AUTH_FORM_TYPE_MAP.SIGN_UP]: 'signUp',
      };
      let response;

      commit('SET_IS_AUTH_LOADING', true);
      try {
        const request = api[methodMap[type]];

        response = await request({ login, password });
      } catch (error) {
        const errorKey = getErrorKey(error.response);
        const message = API_ERROR_MAP.AUTH[errorKey];

        // For 401 status show message from map
        // otherwise show message generated from error
        if (path(['response', 'status'], error) === STATUS_MAP.UNAUTHORIZED && message) {
          commit('SET_AUTH_ERROR', message);
        } else {
          commit('SET_AUTH_ERROR', utils.createMessage(error));
        }
        return;
      } finally {
        commit('SET_IS_AUTH_LOADING', false);
      }
      // After successful request clear error, write user id and login
      // then show player itself
      commit('SET_AUTH_ERROR', '');
      dispatch('setUser', response.data);
    },

    async getUser({ commit, dispatch }) {
      let response;

      commit('SET_IS_USER_DATE_LOADING', true);
      try {
        response = await api.getUser();
      } catch (error) {
        if (path(['response', 'status'], error) !== STATUS_MAP.UNAUTHORIZED) {
          window.console.error(error);
        }
        return;
      } finally {
        commit('SET_IS_USER_DATE_LOADING', false);
      }
      dispatch('setUser', response.data);
    },

    async logout({ state, commit }) {
      if (state.isLogoutProcessing) {
        return;
      }
      commit('SET_IS_LOGOUT_PROCESSING', true);

      try {
        await api.logout();
      } catch (error) {
        if (path(['response', 'status'], error) !== STATUS_MAP.UNAUTHORIZED) {
          window.console.error(error);
        }
        commit('SET_IS_LOGOUT_PROCESSING', false);
        return;
      }

      commit('SET_USER_ID', '');
      commit('SET_LOGIN', '');
      await router.push({ path: '/' });
      commit('SET_IS_LOGOUT_PROCESSING', false);
    },

    clearError({ commit }) {
      commit('SET_AUTH_ERROR', '');
    },
  },
};
