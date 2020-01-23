import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import flushPromises from 'flush-promises';
import vuetify from '@/plugins/vuetify';
import AuthForm from './AuthForm.vue';

const localVue = createLocalVue();

expect.extend({ toMatchDiffSnapshot });

describe('Component AuthForm', () => {
  const createWrapper = ({ isWithoutStubs = false, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(AuthForm, {
      localVue,
      vuetify,
      ...options,
    });

    return { wrapper };
  };

  describe('snapshots', () => {
    it('should match snapshot for login form', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should match snapshot for registration form', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const tree = wrapper.html();

      wrapper.find('.auth-form__sign-up-tab').trigger('click');
      await wrapper.vm.$nextTick();
      expect(tree).toMatchDiffSnapshot(wrapper.html());
    });
  });

  describe('props', () => {
    it('should show error message from prop', () => {
      const { wrapper } = createWrapper({ propsData: { error: 'Some error message' } });

      expect(wrapper.find('v-alert-stub').text()).toBe('Some error message');
    });

    it('should show spinner in submit button while loading', () => {
      const { wrapper } = createWrapper({ propsData: { loading: true } });

      expect(wrapper.find('.auth-form__submit-button').vm.loading).toBe(true);
    });
  });

  describe('events', () => {
    it('should emit toggle-type event after form switch', () => {
      const { wrapper } = createWrapper();

      wrapper.find('.auth-form__sign-up-tab').vm.$emit('click');
      expect(wrapper.emitted()['toggle-type']).toEqual([['sign-up']]);
    });

    it('should show required error for login field', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.findAll('.v-messages__message').at(0).text())
        .toBe('Please enter e-mail');
    });

    it('should show wrong char error for login field', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[name="login"]');

      input.element.value = '~`+===';
      input.trigger('input');
      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.findAll('.v-messages__message').at(0).text())
        .toBe('Incorrect e-mail, try again');
    });

    it('should not emit submit event for login field with error', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[name="password"]');

      input.element.value = 'sam001';
      input.trigger('input');
      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.emitted().submit).toBeUndefined();
    });

    it('should show required error for password field', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.findAll('.v-messages__message').at(1).text())
        .toBe('Please enter password');
    });

    it('should show wrong char error for password field', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[name="password"]');

      input.element.value = '~`+===';
      input.trigger('input');
      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.findAll('.v-messages__message').at(1).text())
        .toBe('Password should have only latin symbols and numbers');
    });

    it('should show too long value error for password field', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[name="password"]');

      input.element.value = 'someLongValue';
      input.trigger('input');
      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.findAll('.v-messages__message').at(1).text())
        .toBe('Password should contain 6 characters');
    });

    it('should not emit submit event for password field with error', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[name="login"]');

      input.element.value = 'user@gmail.com';
      input.trigger('input');
      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.emitted().submit).toBeUndefined();
    });

    it('should not emit submit event for password field with error', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const login = wrapper.find('input[name="login"]');
      const password = wrapper.find('input[name="password"]');

      login.element.value = 'user@gmail.com';
      login.trigger('input');
      password.element.value = 'sam001';
      password.trigger('input');
      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.emitted().submit)
        .toEqual([[{ login: 'user@gmail.com', password: 'sam001', type: 'sign-in' }]]);
    });
  });
});
