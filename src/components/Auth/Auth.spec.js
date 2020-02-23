import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import clone from 'ramda/src/clone';
import Vuex from 'vuex';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import vuetify from '@/plugins/vuetify';
import user from '@/store/modules/user/';
import AuthForm from '@/views/AuthForm/AuthForm.vue';
import Auth from './Auth.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
expect.extend({ toMatchDiffSnapshot });

describe('Component Auth', () => {
  const createWrapper = ({ isWithoutStubs = false, modules = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const store = new Vuex.Store({
      namespaced: true,

      modules: Object.assign({ user }, modules),
    });
    const wrapper = renderer(Auth, {
      localVue,
      vuetify,
      store,
      ...options,
    });

    return { wrapper, store };
  };
  let originGetUser;

  beforeAll(() => {
    originGetUser = user.getUser;
    user.actions.getUser = () => Promise.resolve();
  });

  afterAll(() => {
    user.actions.getUser = originGetUser;
  });

  describe('snapshots', () => {
    it('should match snapshot', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('props', () => {
    it('should transfer isAuthLoading props', () => {
      const userCopy = clone(user);
      const isAuthLoading = true;

      userCopy.state.isAuthLoading = isAuthLoading;
      const { wrapper } = createWrapper({
        modules: { user: userCopy },
        stubs: { AuthForm },
      });

      expect(wrapper.find(AuthForm).props().loading).toBe(isAuthLoading);
    });

    it('should transfer error props', () => {
      const userCopy = clone(user);
      const error = 'Some server error';

      userCopy.state.error = error;
      const { wrapper } = createWrapper({
        modules: { user: userCopy },
        stubs: { AuthForm },
      });

      expect(wrapper.find(AuthForm).props().error).toBe(error);
    });
  });

  describe('events', () => {
    it('should on submit event call auth action', () => {
      const userCopy = clone(user);
      const payload = { login: 'user@gmail.com', password: 'sam001', type: 'sign-in' };
      const spy = jest.fn();

      userCopy.actions.auth = spy;
      const { wrapper } = createWrapper({
        modules: { user: userCopy },
        stubs: { AuthForm },
      });

      wrapper.find(AuthForm).vm.$emit('submit', payload);
      expect(spy.mock.calls[0][1]).toBe(payload);
    });

    it('should on toggle-type event call clearError action', () => {
      const userCopy = clone(user);
      const payload = 'sign-up';
      const spy = jest.fn();

      userCopy.actions.clearError = spy;
      const { wrapper } = createWrapper({
        modules: { user: userCopy },
        stubs: { AuthForm },
      });

      wrapper.find(AuthForm).vm.$emit('toggle-type', payload);
      expect(spy.mock.calls[0][1]).toBe(payload);
    });
  });

  describe('hooks', () => {
    it('should call getUser action after mount', () => {
      const userCopy = clone(user);
      const spy = jest.fn();

      userCopy.actions.getUser = spy;
      createWrapper({ modules: { user: userCopy }, isWithoutStubs: true });

      expect(spy).toHaveBeenCalled();
    });
  });
});
