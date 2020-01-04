import Vue from 'vue';
import Vuex from 'vuex';
import utils from '@/utils';
import tracks from '@/store/modules/tracks/';
import user from '@/store/modules/user/';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: !utils.isProd(),

  namespaced: true,

  modules: {
    tracks,
    user,
  },
});
