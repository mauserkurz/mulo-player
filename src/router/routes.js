import Auth from '../components/Auth/Auth.vue';
import PlayerWrap from '../components/PlayerWrap/PlayerWrap.vue';

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
