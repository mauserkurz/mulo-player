<template>
  <v-list-item
    :class="classMap"
    transition="slide-y-transition"
    @click="switchTrack">
    <v-list-item-icon>
      <v-icon
        v-if="!track.isLoading"
        v-text="icon"
        @click.stop="getTrack"/>

      <v-progress-circular
        v-else
        :size="24"
        indeterminate
        @click.stop="cancelGettingTrack"/>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title v-text="track.name"/>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'TrackListItem',

  props: {
    track: {
      type: Object,
      required: true,
    },

    currentTrackID: {
      type: String,
      required: true,
    },
  },

  computed: {
    classMap() {
      return {
        'v-list-item--active': this.currentTrackID === this.track.id,
        'track-list-item': true,
      };
    },

    icon() {
      return this.track.isLoaded ? 'mdi-check-circle' : 'mdi-cloud-download';
    },
  },

  methods: {
    switchTrack() {
      this.$emit('switch-track', this.track.id);
    },

    getTrack() {
      this.$emit('get-track', this.track.id);
    },

    cancelGettingTrack() {
      this.$emit('cancel-getting-track', this.track.id);
    },
  },
};
</script>

<style scoped lang="less">
.track-list-item {}
</style>
