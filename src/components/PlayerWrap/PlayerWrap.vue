<template>
  <div class="player-wrap">
    <v-row
      align="center"
      justify="space-between">
      <a href="/player" title="Music lover">
        <img alt="App logo" src="@/assets/logo.svg" width="64" height="64">
      </a>

      <v-btn
        color="primary"
        outlined
        @click="logout">
        Logout
      </v-btn>
    </v-row>
    <v-list rounded>
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
    <Player
      :file="currentTrack.blob"
      :file-name="currentTrack.name"/>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';
import Player from '@/views/Player/Player.vue';

export default {
  name: 'PlayerWrap',
  components: { Player },

  computed: {
    ...mapState('tracks', ['trackList']),
    ...mapGetters('tracks', ['currentTrack']),
  },

  methods: {
    ...mapActions('user', ['logout']),
    ...mapActions('tracks', ['getTrack', 'getTrackList', 'switchTrack']),

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
  },

  async mounted() {
    await this.getTrackList();
  },
};
</script>

<style scoped lang="less">
.player-wrap {
  position: relative;
  z-index: 0;
  width: 518px;
  margin: 20px auto;
}
</style>
