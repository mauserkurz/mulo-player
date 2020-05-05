import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import draggable from 'vuedraggable';
import createTrack from '@/models/track/createTrack';
import vuetify from '@/plugins/vuetify';
import { FILTER_TRACK_TYPE_KEYS, SORT_TRACK_TYPE_KEYS } from '@/constants';
import TrackListSetting from '@/views/TrackListSetting/TrackListSetting.vue';
import TrackListSearch from '@/views/TrackListSearch/TrackListSearch.vue';
import TrackListItem from '@/views/TrackListItem/TrackListItem.vue';
import TrackList from './TrackList.vue';

const localVue = createLocalVue();

describe('Component TrackList', () => {
  const trackList = [
    createTrack({
      id: 0,
      name: 'Band 0 - Song 0',
      isLoading: true,
      lastModifiedDate: new Date('2020-04-08').getTime(),
    }),
    createTrack({
      id: 1,
      name: 'Band 1 - Song 1',
      blob: new Blob([], { type: 'audio/mpeg' }),
      lastModifiedDate: new Date('2020-04-10').getTime(),
    }),
    createTrack({
      id: 2,
      name: 'Band 2 - Song 2',
      lastModifiedDate: new Date('2020-04-11').getTime(),
    }),
    createTrack({
      id: 3,
      name: 'Band 3 - Song 3',
      lastModifiedDate: new Date('2020-04-09').getTime(),
    }),
  ];
  const defaultProps = {
    trackList,
    currentTrackID: trackList[0].id,
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
      const { wrapper } = createWrapper();

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('events', () => {
    describe('sort tracks after select sorting type', () => {
      it('should show alphanumeric ascending track list', () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSetting } });
        const payload = SORT_TRACK_TYPE_KEYS.ABC;

        wrapper.find(TrackListSetting).vm.$emit('input-sort-type', payload);
        expect(wrapper.vm.filteredTrackList).toEqual(trackList);
      });

      it('should show alphanumeric descending track list', () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSetting } });
        const payload = SORT_TRACK_TYPE_KEYS.CBA;

        wrapper.find(TrackListSetting).vm.$emit('input-sort-type', payload);
        expect(wrapper.vm.filteredTrackList).toEqual(trackList.slice().reverse());
      });

      it('should show new tracks at first', () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSetting } });
        const payload = SORT_TRACK_TYPE_KEYS.NEW;
        const sortedList = [trackList[2], trackList[1], trackList[3], trackList[0]];

        wrapper.find(TrackListSetting).vm.$emit('input-sort-type', payload);
        expect(wrapper.vm.filteredTrackList).toEqual(sortedList);
      });

      it('should show old tracks at first', () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSetting } });
        const payload = SORT_TRACK_TYPE_KEYS.OLD;
        const sortedList = [trackList[0], trackList[3], trackList[1], trackList[2]];

        wrapper.find(TrackListSetting).vm.$emit('input-sort-type', payload);
        expect(wrapper.vm.filteredTrackList).toEqual(sortedList);
      });

      it('should show custom sorted list', async () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSetting, draggable } });
        const payload = SORT_TRACK_TYPE_KEYS.CUSTOM;
        const sortedList = [trackList[0], trackList[2], trackList[1], trackList[3]];

        wrapper.find(TrackListSetting).vm.$emit('input-sort-type', payload);
        wrapper.find(draggable).vm.$emit('input', sortedList);
        expect(wrapper.emitted()['update-track-list']).toEqual([[sortedList]]);
      });
    });

    describe('filter tracks after select filtering type and search input', () => {
      it('should show filtered by substring track list', async () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSearch } });
        const searchString = 'Band 0';

        wrapper.find(TrackListSearch).vm.$emit('input', searchString);
        expect(wrapper.vm.filteredTrackList).toEqual([trackList[0]]);
      });

      it('should show tracks newer then date in search', async () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSearch, TrackListSetting } });
        const payload = FILTER_TRACK_TYPE_KEYS.NEW;
        const searchString = '2020-04-09';

        wrapper.find(TrackListSetting).vm.$emit('input-filter-type', payload);
        wrapper.find(TrackListSearch).vm.$emit('input', searchString);
        expect(wrapper.vm.filteredTrackList).toEqual([trackList[1], trackList[2]]);
      });

      it('should show tracks older then date in search', async () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSearch, TrackListSetting } });
        const payload = FILTER_TRACK_TYPE_KEYS.OLD;
        const searchString = '2020-04-10';

        wrapper.find(TrackListSetting).vm.$emit('input-filter-type', payload);
        wrapper.find(TrackListSearch).vm.$emit('input', searchString);
        expect(wrapper.vm.filteredTrackList).toEqual([trackList[0], trackList[3]]);
      });

      it('should show tracks with same date in search', async () => {
        const { wrapper } = createWrapper({ stubs: { TrackListSearch, TrackListSetting } });
        const payload = FILTER_TRACK_TYPE_KEYS.DURING;
        const searchString = '2020-04-11';

        wrapper.find(TrackListSetting).vm.$emit('input-filter-type', payload);
        wrapper.find(TrackListSearch).vm.$emit('input', searchString);
        expect(wrapper.vm.filteredTrackList).toEqual([trackList[2]]);
      });
    });

    it('should emit switch-track event after switch-track event from TrackListItem', () => {
      const { wrapper } = createWrapper({ stubs: { TrackListItem } });
      const payload = '1';

      wrapper.find(TrackListItem).vm.$emit('switch-track', payload);
      expect(wrapper.emitted()['switch-track']).toEqual([[payload]]);
    });

    it('should emit get-track event after get-track event from TrackListItem', () => {
      const { wrapper } = createWrapper({ stubs: { TrackListItem } });
      const payload = '1';

      wrapper.find(TrackListItem).vm.$emit('get-track', payload);
      expect(wrapper.emitted()['get-track']).toEqual([[payload]]);
    });

    it('should emit cancel-getting-track event after cancel-getting-track event from TrackListItem', () => {
      const { wrapper } = createWrapper({ stubs: { TrackListItem } });
      const payload = '1';

      wrapper.find(TrackListItem).vm.$emit('cancel-getting-track', payload);
      expect(wrapper.emitted()['cancel-getting-track']).toEqual([[payload]]);
    });
  });
});
