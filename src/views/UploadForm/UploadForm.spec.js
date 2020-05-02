import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import flushPromises from 'flush-promises';
import vuetify from '@/plugins/vuetify';
import UploadForm from './UploadForm.vue';

const localVue = createLocalVue();

expect.extend({ toMatchDiffSnapshot });

describe('Component UploadForm', () => {
  const mockFileInput = (input) => {
    let files;

    Object.defineProperty(input.element, 'files', {
      get() {
        return files;
      },
    });

    Object.defineProperty(input.element, 'value', {
      get() {
        return files;
      },

      set(value) {
        files = value;
      },
    });
  };

  const createWrapper = ({ isWithoutStubs = false, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(UploadForm, {
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
  });

  describe('props', () => {
    it('should show error message from prop', () => {
      const { wrapper } = createWrapper({ propsData: { error: 'Some error message' } });

      expect(wrapper.find('v-alert-stub').text()).toBe('Some error message');
    });

    it('should show spinner in submit button while loading', () => {
      const { wrapper } = createWrapper({ propsData: { loading: true } });

      expect(wrapper.find('v-btn-stub').vm.loading).toBe(true);
    });

    describe('isHidden represent drawer showing change', () => {
      it('should after change isHidden to true reset form', async () => {
        const { wrapper } = createWrapper({ isWithoutStubs: true, propsData: { isHidden: false } });
        const spy = jest.spyOn(wrapper.vm.$refs.form, 'reset');

        wrapper.setProps({ isHidden: true });
        await wrapper.vm.$nextTick();
        expect(spy).toHaveBeenCalled();
      });

      it('should after change isHidden to true send event clear-form', async () => {
        const { wrapper } = createWrapper({ isWithoutStubs: true, propsData: { isHidden: false } });

        wrapper.setProps({ isHidden: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['clear-form']).toEqual([[]]);
      });
    });
  });

  describe('events', () => {
    it('should show required error for file field', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.findAll('.v-messages__message').at(0).text())
        .toBe('Please select mp3 file');
    });

    it('should not emit submit event for file field with error', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.emitted().submit).toBeUndefined();
    });

    it('should emit submit for valid form with changed meme type', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[type="file"]');
      const file = new File([], 'track', { type: 'audio/mp3' });

      mockFileInput(input);
      input.element.value = [file];
      input.trigger('change');

      wrapper.find('.v-form').vm.$emit('submit', { preventDefault() {} });
      await flushPromises();
      expect(wrapper.emitted().submit).toEqual([[file]]);
    });
  });
});
