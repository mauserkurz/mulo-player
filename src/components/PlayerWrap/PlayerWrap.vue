<template>
  <div class="player-wrap">
    <img alt="App logo" src="@/assets/logo.svg" width="256" height="256">
    <v-list rounded>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="track of trackList"
          :key="track.id"
          @click="SET_CURRENT_TRACK_ID(track.id)">
          <v-list-item-content>
            <v-list-item-title
              v-text="track.name"/>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <Player :file="URL"/>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
} from 'vuex';
import Player from '@/views/Player/Player.vue';

export default {
  name: 'PlayerWrap',
  components: { Player },

  computed: {
    ...mapState('tracks', ['trackList', 'currentTrackID']),

    URL() {
      return `http://localhost:3000/api/users/12345/soundtracks/${this.currentTrackID}.mp3`;
    },
  },

  methods: {
    ...mapMutations('tracks', ['SET_CURRENT_TRACK_ID']),
    ...mapActions('tracks', ['getTrackList']),
  },

  async mounted() {
    // TODO add spinner
    await this.getTrackList();
  },
};
</script>

<style scoped lang="less">
.player-wrap {}
</style>
