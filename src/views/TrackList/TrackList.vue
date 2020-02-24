<template>
  <v-list
    class="track-list"
    rounded>
    <v-list-item-group color="primary">
      <v-list-item
        v-for="track of trackList"
        :key="track.id"
        :class="{ 'v-list-item--active': isTrackSelected(track.id) }"
        @click="switchTrack(track.id)">
        <v-list-item-icon @click.stop="getTrack(track.id)">
          <v-icon
            v-if="!track.isLoading"
            v-text="getIcon(track.isLoaded)"/>
          <v-progress-circular
            v-else
            :size="24"
            indeterminate/>
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
  },
};
</script>

<style scoped lang="less">
.track-list {}
</style>
