import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import createTrack from '@/models/track/createTrack';
import vuetify from '@/plugins/vuetify';
import TrackList from './TrackList.vue';

const localVue = createLocalVue();

describe('Component TrackList', () => {
  const trackList = [
    createTrack({
      id: 0,
      name: 'Band 0 - Song 0',
      isLoading: true,
    }),
    createTrack({
      id: 1,
      name: 'Band 1 - Song 1',
      blob: new Blob([], { type: 'audio/mpeg' }),
    }),
    createTrack({
      id: 2,
      name: 'Band 2 - Song 2',
    }),
  ];
  const defaultProps = {
    trackList,
    currentTrack: trackList[0],
  };
  const createWrapper = ({ isWithoutStubs = false, propsData = {}, ...options } = {}) => {
    const renderer = isWithoutStubs ? mount : shallowMount;
    const wrapper = renderer(TrackList, {
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
    it('should emit switch-track event after click on list item', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.findAll('.v-list-item').at(1).trigger('click');
      expect(wrapper.emitted()['switch-track']).toEqual([[1]]);
    });

    it('should emit get-track event after click on download icon', () => {
      const { wrapper } = createWrapper({
        stubs: {
          'v-icon': {
            template: '<div class="v-icon" @click="$listeners.click" />',
          },
        },
      });

      wrapper.findAll('.v-icon').at(0).trigger('click');
      expect(wrapper.emitted()['get-track']).toEqual([[1]]);
    });

    it('should emit cancel-getting-track event after click on spinner icon', () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });

      wrapper.find('.v-progress-circular').trigger('click');
      expect(wrapper.emitted()['cancel-getting-track']).toEqual([[0]]);
    });

    it('should show filtered list after search input', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[type="text"]');

      input.element.value = 'Band 1';
      input.trigger('input');
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.v-list-item__title').length).toBe(1);
      expect(wrapper.find('.v-list-item__title').text()).toBe(trackList[1].name);
    });

    it('should clear search input after click on clear icon', async () => {
      const { wrapper } = createWrapper({ isWithoutStubs: true });
      const input = wrapper.find('input[type="text"]');

      input.element.value = 'Band 1';
      input.trigger('input');
      await wrapper.vm.$nextTick();
      wrapper.find('.v-input').vm.$emit('click:clear');
      await wrapper.vm.$nextTick();

      expect(input.element.value).toBe('');
    });
  });
});
