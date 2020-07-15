<template>
  <v-list
    class="track-list"
    rounded>
    <v-list-item-group
      color="primary">
      <TrackListSetting
        :sortType="sortType"
        :filterType="filterType"
        @input-sort-type="onInputSortType"
        @input-filter-type="onInputFilterType"/>

      <TrackListSearch
        v-model="search"
        :filterType="filterType"/>

      <draggable
        v-model="filteredTrackList"
        :draggable="draggable">
        <transition-group name="slide-y-transition">
          <TrackListItem
            v-for="track of filteredTrackList"
            :key="track.id"
            :track="track"
            :currentTrackID="currentTrackID"
            @switch-track="switchTrack"
            @get-track="getTrack"
            @cancel-getting-track="cancelGettingTrack"/>
        </transition-group>
      </draggable>
    </v-list-item-group>
  </v-list>
</template>

<script>
import draggable from 'vuedraggable';
import TrackListSetting from '@/views/TrackListSetting/TrackListSetting.vue';
import TrackListSearch from '@/views/TrackListSearch/TrackListSearch.vue';
import TrackListItem from '@/views/TrackListItem/TrackListItem.vue';
import { FILTER_TRACK_TYPE_KEYS, SORT_TRACK_TYPE_KEYS } from '@/constants';

export default {
  name: 'TrackList',

  components: {
    draggable,
    TrackListSetting,
    TrackListSearch,
    TrackListItem,
  },

  props: {
    trackList: {
      type: Array,
      required: true,
    },

    currentTrackID: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      search: '',
      sortType: SORT_TRACK_TYPE_KEYS.CUSTOM,
      filterType: FILTER_TRACK_TYPE_KEYS.TEXT,

      sorterCallBackMap: {
        [SORT_TRACK_TYPE_KEYS.ABC]: (prev, next) => prev.name.localeCompare(next.name),
        [SORT_TRACK_TYPE_KEYS.CBA]: (prev, next) => next.name.localeCompare(prev.name),
        [SORT_TRACK_TYPE_KEYS.NEW]: (prev, next) => next.lastModifiedDate - prev.lastModifiedDate,
        [SORT_TRACK_TYPE_KEYS.OLD]: (prev, next) => prev.lastModifiedDate - next.lastModifiedDate,
        [SORT_TRACK_TYPE_KEYS.CUSTOM]: () => 0,
      },

      filterCallBackMap: {
        [FILTER_TRACK_TYPE_KEYS.TEXT]: ({ name }) => !this.search
          || name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()),
        [FILTER_TRACK_TYPE_KEYS.NEW]: ({ lastModifiedDate }) => !this.search
          || lastModifiedDate > new Date(this.search).getTime(),
        [FILTER_TRACK_TYPE_KEYS.OLD]: ({ lastModifiedDate }) => !this.search
          || lastModifiedDate < new Date(this.search).getTime(),
        [FILTER_TRACK_TYPE_KEYS.DURING]: ({ lastModifiedDate }) => !this.search
          || new Date(lastModifiedDate).toLocaleDateString()
          === new Date(this.search).toLocaleDateString(),
      },
    };
  },

  computed: {
    filteredTrackList: {
      get() {
        return this.trackList.filter(this.filterCallBack).sort(this.sorterCallBack);
      },

      set(value) {
        this.$emit('update-track-list', value);
      },
    },

    sorterCallBack() {
      return this.sorterCallBackMap[this.sortType];
    },

    filterCallBack() {
      return this.filterCallBackMap[this.filterType];
    },

    draggable() {
      return this.sortType === SORT_TRACK_TYPE_KEYS.CUSTOM ? '.v-list-item' : '';
    },
  },

  methods: {
    onInputSortType(value) {
      this.sortType = value;
    },

    onInputFilterType(value) {
      this.filterType = value;
    },

    switchTrack(trackID) {
      this.$emit('switch-track', trackID);
    },

    getTrack(trackID) {
      this.$emit('get-track', trackID);
    },

    cancelGettingTrack(trackID) {
      this.$emit('cancel-getting-track', trackID);
    },
  },
};
</script>

<style scoped lang="less">
.track-list {}
</style>
