import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import { FILTER_TRACK_TYPE_KEYS } from '@/constants';
import TrackListSearch from './TrackListSearch.vue';

const localVue = createLocalVue();

describe('Component TrackListSearch', () => {
  const defaultProps = {
    value: '',
    filterType: FILTER_TRACK_TYPE_KEYS.TEXT,
  };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(TrackListSearch, {
      localVue,
      vuetify,
      propsData: Object.assign({}, defaultProps, propsData),
      ...options,
    });

    return { wrapper };
  };

  describe('snapshots', () => {
    it('text search should match snapshot', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('date search with opened date picker should match snapshot', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.setProps({ filterType: FILTER_TRACK_TYPE_KEYS.NEW });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should emit text input value', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[type="text"]');
      const value = 'Band 1';

      input.element.value = value;
      input.trigger('input');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().input).toEqual([[value]]);
    });

    it('after change filterType to text should hide date picker', async () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { filterType: FILTER_TRACK_TYPE_KEYS.DURING },
      });

      wrapper.setProps({ filterType: FILTER_TRACK_TYPE_KEYS.TEXT });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.v-picker').exists()).toBe(false);
    });

    it('should emit input with "" after click on clear icon', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true, propsData: { value: 'Band 0' } });

      wrapper.find('.v-text-field').vm.$emit('click:clear');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().input).toEqual([['']]);
    });

    it('after change filterType to date type should show date picker', async () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { filterType: FILTER_TRACK_TYPE_KEYS.TEXT },
      });

      wrapper.setProps({ filterType: FILTER_TRACK_TYPE_KEYS.DURING });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.v-picker').exists()).toBe(true);
    });

    it('on select date should emit date picker value', async () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { filterType: FILTER_TRACK_TYPE_KEYS.TEXT },
      });
      const value = '2020-04-15';

      wrapper.setProps({ filterType: FILTER_TRACK_TYPE_KEYS.DURING });
      await wrapper.vm.$nextTick();
      wrapper.find('.v-picker').vm.$emit('input', value);
      expect(wrapper.emitted().input).toEqual([[''], [value]]);
    });

    it('after click on Cancel button should hide date picker', async () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { filterType: FILTER_TRACK_TYPE_KEYS.TEXT },
      });

      wrapper.setProps({ filterType: FILTER_TRACK_TYPE_KEYS.DURING });
      await wrapper.vm.$nextTick();
      wrapper.findAll('.v-btn').at(33).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.v-menu__content').element.style.display)
        .toBe('none');
    });

    it('after click on Ok button should hide date picker', async () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { filterType: FILTER_TRACK_TYPE_KEYS.TEXT },
      });

      wrapper.setProps({ filterType: FILTER_TRACK_TYPE_KEYS.DURING });
      await wrapper.vm.$nextTick();
      wrapper.findAll('.v-btn').at(34).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.v-menu__content').element.style.display)
        .toBe('none');
    });
  });
});
