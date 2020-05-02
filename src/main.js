import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  const isAuthorized = store.getters['user/isAuthorized'];

  if (to.fullPath.startsWith('/player') && !isAuthorized) {
    next('/');
  } else if (to.fullPath === '/' && isAuthorized) {
    next('/player');
  } else if (to.name === null) {
    next('/');
  }
  next();
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
