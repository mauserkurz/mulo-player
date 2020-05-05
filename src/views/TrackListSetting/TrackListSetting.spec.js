import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import { FILTER_TRACK_TYPE_KEYS, SORT_TRACK_TYPE_KEYS } from '@/constants';
import TrackListSetting from './TrackListSetting.vue';

const localVue = createLocalVue();

describe('Component TrackListSetting', () => {
  const defaultProps = {
    sortType: SORT_TRACK_TYPE_KEYS.ABC,
    filterType: FILTER_TRACK_TYPE_KEYS.TEXT,
  };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(TrackListSetting, {
      localVue,
      vuetify,
      propsData: Object.assign({}, defaultProps, propsData),
      ...options,
    });

    return { wrapper };
  };

  describe('snapshots', () => {
    it('should match snapshot', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should after select filterType emit event input-filter-type with value', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-select').vm
        .$emit('input', FILTER_TRACK_TYPE_KEYS.NEW);
      expect(wrapper.emitted()['input-filter-type']).toEqual([[FILTER_TRACK_TYPE_KEYS.NEW]]);
    });

    it('should after select sortType emit event input-sort-type with value', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.findAll('.v-select').at(1).vm
        .$emit('input', SORT_TRACK_TYPE_KEYS.CBA);
      expect(wrapper.emitted()['input-sort-type']).toEqual([[SORT_TRACK_TYPE_KEYS.CBA]]);
    });
  });
});
