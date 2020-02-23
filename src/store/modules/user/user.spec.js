import Vuex from 'vuex';
import Vue from 'vue';
import clone from 'ramda/src/clone';
import api from '@/api/';
import router from '@/router';
import user from './index';

Vue.use(Vuex);

describe('Module user', () => {
  const createStore = ({ ...modules } = {}) => new Vuex.Store({
    namespaced: true,

    modules: Object.assign({ user }, modules),
  });
  let routerPush;

  beforeAll(() => {
    routerPush = router.push;
    router.push = () => {};
  });

  afterAll(() => {
    router.push = routerPush;
  });

  describe('getters', () => {
    it('isAuthorized should be true, when userID is known', () => {
      const userCopy = clone(user);

      userCopy.state.userID = '01234';
      const store = createStore({ user: userCopy });

      expect(store.getters['user/isAuthorized']).toBe(true);
    });
  });

  describe('actions', () => {
    it('clearError should remove error', () => {
      const userCopy = clone(user);

      userCopy.state.error = 'Some error';
      const store = createStore({ user: userCopy });

      store.dispatch('user/clearError');
      expect(store.state.user.error).toBe('');
    });

    describe('auth handle sign up and sign in operations', () => {
      it('should call sign up request', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const handler = api.signUp;
        const spy = jest.fn(() => Promise.resolve({
          status: 200,
          data: { user_id: '012345', login: 'user@gmail.com' },
        }));

        api.signUp = spy;
        await store.dispatch('user/auth', { ...params, type: 'sign-up' });
        api.signUp = handler;
        expect(spy).toBeCalledWith(params);
      });

      it('should call sign in request', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const handler = api.signIn;
        const spy = jest.fn(() => Promise.resolve({
          status: 200,
          data: { user_id: '012345', login: 'user@gmail.com' },
        }));

        api.signIn = spy;
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        api.signIn = handler;
        expect(spy).toBeCalledWith(params);
      });

      it('should after request save user id', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const userID = '012345';
        const handler = api.signIn;

        api.signIn = jest.fn(async () => ({ data: { user_id: userID, login: 'user@gmail.com' } }));
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        api.signIn = handler;
        expect(store.state.user.userID).toBe(userID);
      });

      it('should after request save user login', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const login = 'user@gmail.com';
        const params = { login, password: 'sam001' };
        const handler = api.signIn;

        api.signIn = jest.fn(async () => ({ data: { user_id: '012345', login } }));
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        api.signIn = handler;
        expect(store.state.user.login).toBe(login);
      });

      it('should after request clear error', async () => {
        const userCopy = clone(user);

        userCopy.state.error = 'Some error';
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const handler = api.signIn;

        api.signIn = jest.fn(async () => ({ data: { user_id: '012345', login: 'user@gmail.com' } }));
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        api.signIn = handler;
        expect(store.state.user.error).toBe('');
      });

      it('should after request redirect to player', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const handler = api.signIn;
        const spy = jest.fn();

        router.push = spy;
        api.signIn = jest.fn(async () => ({ data: { user_id: '012345', login: 'user@gmail.com' } }));
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        router.push = () => {};
        api.signIn = handler;
        expect(spy).toHaveBeenCalledWith({ path: 'player' });
      });

      it('should after response with 401 status show custom message', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const handler = api.signIn;
        const error = new Error();

        error.response = { status: 401, data: { errors: [{ message: 'INCORRECT_PASSWORD_OR_LOGIN' }] } };
        api.signIn = jest.fn(() => Promise.reject(error));
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        api.signIn = handler;
        expect(store.state.user.error).toBe('Incorrect login or password, try to use another data');
      });

      it('should after response with 500 status show message', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const params = { login: 'user@gmail.com', password: 'sam001' };
        const handler = api.signIn;
        const error = new Error('Request failed with status code 500');

        error.response = { status: 500, statusText: 'Internal Server Error' };
        api.signIn = jest.fn(() => Promise.reject(error));
        await store.dispatch('user/auth', { ...params, type: 'sign-in' });
        api.signIn = handler;
        expect(store.state.user.error)
          .toBe('Internal Server Error: Error: Request failed with status code 500');
      });
    });

    describe('getUser fetch user data and save it', () => {
      it('should call API method', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const handler = api.getUser;
        const spy = jest.fn(() => Promise.resolve({
          status: 200,
          data: { user_id: '012345', login: 'user@gmail.com' },
        }));

        api.getUser = spy;
        await store.dispatch('user/getUser');
        api.signUp = handler;
        expect(spy).toHaveBeenCalled();
      });

      it('should call API method once after two quick call', () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const handler = api.logout;
        const spy = jest.fn(() => Promise.resolve({ status: 200 }));

        api.logout = spy;
        store.dispatch('user/logout');
        store.dispatch('user/logout');
        api.logout = handler;
        expect(spy).toBeCalledTimes(1);
      });

      it('should after request save user id', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const userID = '012345';
        const handler = api.getUser;

        api.getUser = jest.fn(async () => ({ data: { user_id: userID, login: 'user@gmail.com' } }));
        await store.dispatch('user/getUser');
        api.getUser = handler;
        expect(store.state.user.userID).toBe(userID);
      });

      it('should after request save user login', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const login = 'user@gmail.com';
        const handler = api.getUser;

        api.getUser = jest.fn(async () => ({ data: { user_id: '012345', login } }));
        await store.dispatch('user/getUser');
        api.getUser = handler;
        expect(store.state.user.login).toBe(login);
      });

      it('should failed request don`t change user data', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const handler = api.getUser;
        const error = new Error();

        error.response = { status: 401, data: {} };
        api.getUser = jest.fn(() => Promise.reject(error));
        await store.dispatch('user/getUser');
        api.getUser = handler;
        expect(store.state.user.userID).toBe('');
      });
    });

    describe('logout exit from app and clear user data', () => {
      it('should call API method', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const handler = api.logout;
        const spy = jest.fn(() => Promise.resolve({ status: 200 }));

        api.logout = spy;
        await store.dispatch('user/logout');
        api.logout = handler;
        expect(spy).toHaveBeenCalled();
      });

      it('should after request clear user id', async () => {
        const userCopy = clone(user);

        userCopy.state.userID = '012345';
        const store = createStore({ user: userCopy });
        const handler = api.logout;

        api.logout = jest.fn(() => Promise.resolve({ status: 200 }));
        await store.dispatch('user/logout');
        api.logout = handler;
        expect(store.state.user.userID).toBe('');
      });

      it('should after request clear user login', async () => {
        const userCopy = clone(user);

        userCopy.state.login = 'user@gmail.com';
        const store = createStore({ user: userCopy });
        const handler = api.logout;

        api.logout = jest.fn(() => Promise.resolve({ status: 200 }));
        await store.dispatch('user/logout');
        api.logout = handler;
        expect(store.state.user.login).toBe('');
      });

      it('should after request redirect to root', async () => {
        const userCopy = clone(user);
        const store = createStore({ user: userCopy });
        const handler = api.logout;
        const spy = jest.fn();

        router.push = spy;
        api.logout = jest.fn(() => Promise.resolve({ status: 200 }));
        await store.dispatch('user/logout');
        router.push = () => {};
        api.logout = handler;
        expect(spy).toHaveBeenCalledWith({ path: '/' });
      });

      it('should failed request don`t clear user data', async () => {
        const userCopy = clone(user);
        const userID = '012345';

        userCopy.state.userID = userID;
        const store = createStore({ user: userCopy });
        const handler = api.logout;
        const error = new Error();

        error.response = { status: 401 };
        api.logout = jest.fn(() => Promise.reject(error));
        await store.dispatch('user/logout');
        api.logout = handler;
        expect(store.state.user.userID).toBe(userID);
      });
    });
  });
});
