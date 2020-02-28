<template>
  <v-sheet>
    <v-container class="player-wrap">
      <PlayerHeader @logout="logout"/>

      <TrackList
        :track-list="trackList"
        :current-track="currentTrack"
        @switch-track="switchTrack"
        @get-track="getTrack"
        @cancel-getting-track="cancelGettingTrack"/>

      <footer class="player-wrap__footer">
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            dark
            small
            fab
            @click="switchDrawer(true)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-actions>

        <Player
          :file="currentTrack.blob"
          :file-name="currentTrack.name"/>
      </footer>
    </v-container>

    <Drawer v-model="isDrawerShown">
      <UploadForm
        :loading="isFileSending"
        :error="sendingFileError"
        @submit="onUploadFormSubmit"/>
    </Drawer>
  </v-sheet>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';
import Player from '@/views/Player/Player.vue';
import PlayerHeader from '@/views/PlayerHeader/PlayerHeader.vue';
import TrackList from '@/views/TrackList/TrackList.vue';
import UploadForm from '@/views/UploadForm/UploadForm.vue';
import Drawer from '@/views/Drawer/Drawer.vue';

export default {
  name: 'PlayerWrap',
  components: {
    Player,
    PlayerHeader,
    TrackList,
    UploadForm,
    Drawer,
  },

  data() {
    return {
      isDrawerShown: false,
    };
  },

  computed: {
    ...mapState('tracks', ['trackList', 'sendingFileError', 'isFileSending']),
    ...mapGetters('tracks', ['currentTrack']),
  },

  methods: {
    ...mapActions('user', ['logout']),
    ...mapActions('tracks', ['getTrack', 'getTrackList', 'switchTrack', 'sendFile', 'cancelGettingTrack']),

    switchDrawer(state) {
      this.isDrawerShown = state;
    },

    async onUploadFormSubmit(file) {
      const isSucceed = await this.sendFile(file);

      if (isSucceed) {
        this.switchDrawer(false);
      }
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
  width: 543px;
  margin: 20px auto;

  &__footer {
    position: sticky;
    bottom: 20px;
  }
}
</style>
