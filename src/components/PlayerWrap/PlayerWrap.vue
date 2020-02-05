<template>
  <div class="player-wrap">
    <img alt="App logo" src="@/assets/logo.svg" width="256" height="256">
    <v-list rounded>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="track of trackList"
          :key="track.id"
          @click="switchTrack(track.id)">
          <v-list-item-content>
            <v-list-item-title
              v-text="track.name"/>
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
    ...mapActions('tracks', ['getTrackList', 'switchTrack']),
  },

  async mounted() {
    await this.getTrackList();
  },
};
</script>

<style scoped lang="less">
.player-wrap {}
</style>
