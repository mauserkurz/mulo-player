import Auth from '../views/Auth.vue';
import PlayerWrap from '../views/PlayerWrap.vue';

export default [
  {
    path: '/',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/player',
    name: 'player',
    component: PlayerWrap,
  },
];
