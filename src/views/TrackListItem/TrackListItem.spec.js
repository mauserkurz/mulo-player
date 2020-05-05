import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import vuetify from '@/plugins/vuetify';
import createTrack from '@/models/track/createTrack';
import TrackListItem from './TrackListItem.vue';

const localVue = createLocalVue();

describe('Component TrackListItem', () => {
  const defaultProps = {
    track: createTrack({ id: 1, name: 'Band 0 - Song 0' }),
    currentTrackID: '2',
  };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(TrackListItem, {
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

    it('should show spinner when track loading', () => {
      const track = createTrack({ id: 1, isLoading: true });
      const { wrapper } = createWrapper({ isWithoutStubs: true, propsData: { track } });

      expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
    });

    it('should add v-list-item--active class for current track', () => {
      const { wrapper } = createWrapper({
        isWithoutStubs: true,
        propsData: { currentTrackID: defaultProps.track.id },
      });

      expect(wrapper.find('.v-list-item--active').exists()).toBe(true);
    });
  });

  describe('events', () => {
    it('should emit switch-track event after click on list item', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.trigger('click');
      expect(wrapper.emitted()['switch-track']).toEqual([[defaultProps.track.id]]);
    });

    it('should emit get-track event after click on download icon', () => {
      const { wrapper } = createWrapper({
        stubs: {
          'v-icon': {
            template: '<div class="v-icon" @click="$listeners.click" />',
          },
        },
      });

      wrapper.find('.v-icon').trigger('click');
      expect(wrapper.emitted()['get-track']).toEqual([[defaultProps.track.id]]);
    });

    it('should emit cancel-getting-track event after click on spinner icon', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const track = createTrack({ id: 1, isLoading: true });

      wrapper.setProps({ track });
      wrapper.find('.v-progress-circular').trigger('click');
      expect(wrapper.emitted()['cancel-getting-track']).toEqual([[track.id]]);
    });
  });
});
