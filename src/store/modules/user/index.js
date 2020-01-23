import { path, pathOr } from 'ramda';
import api from '@/api/';
import router from '@/router';
import { AUTH_FORM_TYPE_MAP, STATUS_MAP, API_ERROR_MAP } from '@/const';

const getErrorKey = response => pathOr([], ['data', 'errors'], response)
  .map(({ message }) => message)
  .join(', ');
const createMessage = (error) => {
  if (error.response) {
    return `${error.response.statusText}: ${error}`;
  }
  return error.toString();
};

export default {
  namespaced: true,

  state: {
    userID: '',
    login: '',
    error: '',
    isAuthLoading: false,
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
  },

  actions: {
    async auth({ commit }, { login, password, type }) {
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
          commit('SET_AUTH_ERROR', createMessage(error));
        }
        return;
      } finally {
        commit('SET_IS_AUTH_LOADING', false);
      }
      // After successful request clear error, write user id and login
      // then show player itself
      commit('SET_AUTH_ERROR', '');
      commit('SET_USER_ID', response.data.user_id);
      commit('SET_LOGIN', response.data.login);
      router.push({ path: 'player' });
    },

    clearError({ commit }) {
      commit('SET_AUTH_ERROR', '');
    },
  },
};
