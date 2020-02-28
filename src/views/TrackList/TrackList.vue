<template>
  <v-list
    class="track-list"
    rounded>
    <v-list-item-group
      color="primary">
      <v-text-field
        v-model="search"
        prepend-inner-icon="search"
        flat
        solo-inverted
        clearable
        label="Search"
        @click:clear="clearSearch"/>

      <v-list-item
        v-for="track of filteredTrackList"
        :key="track.id"
        :class="{ 'v-list-item--active': isTrackSelected(track.id) }"
        @click="switchTrack(track.id)">
        <v-list-item-icon>
          <v-icon
            v-if="!track.isLoading"
            v-text="getIcon(track.isLoaded)"
            @click.stop="getTrack(track.id)"/>
          <v-progress-circular
            v-else
            :size="24"
            indeterminate
            @click.stop="cancelGettingTrack(track.id)"/>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="track.name"/>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'TrackList',

  props: {
    trackList: {
      type: Array,
      required: true,
    },

    currentTrack: {
      type: Object,
      required: true,
    },
  },

  data() {
    return { search: '' };
  },

  computed: {
    filteredTrackList() {
      return this.trackList.filter(({ name }) => !this.search || name.includes(this.search));
    },
  },

  methods: {
    isTrackSelected(trackID) {
      return this.currentTrack.id === trackID;
    },

    getIcon(isLoaded) {
      let icon = 'mdi-cloud-download';

      if (isLoaded) {
        icon = 'mdi-check-circle';
      }
      return icon;
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

    clearSearch() {
      this.search = '';
    },
  },
};
</script>

<style scoped lang="less">
.track-list {}
</style>
