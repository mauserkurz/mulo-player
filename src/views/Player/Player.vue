<template>
  <div class="player">
    <Control
      title="Stop"
      icon-name="stop"
      @click="() => audio.stop()"/>

    <Control
      :is-active="audio.playing"
      title="Play/Pause"
      iconName="pause"
      active-icon-name="play"
      @click="switchPlaying"/>

    <TimeLine
      :current-seconds="audio.currentSeconds"
      :duration-seconds="audio.durationSeconds"
      @rewind="rewind"/>

    <Control
      title="Download"
      icon-name="download"
      @click="download"/>

    <Control
      :is-active="audio.element.loop"
      title="Loop/Once"
      iconName="once"
      active-icon-name="loop"
      @click="switchLoop"/>

    <Control
      :is-active="audio.muted"
      title="Mute"
      iconName="sound"
      active-icon-name="mute"
      @click="mute"/>

    <Control
      title="Volume"
      icon-name="volume"
      @mouseover.native="setShowVolume(true)"
      @mouseleave.native="setShowVolume(false)">

      <input
        v-show="showVolume"
        v-model="audio.element.volume"
        type="range"
        min="0"
        step="0.01"
        max="1"/>
    </Control>
  </div>
</template>

<script>
import createAudio from '@/models/audio/createAudio';
import TimeLine from '@/views/TimeLine/TimeLine.vue';
import Control from '@/views/Control/Control.vue';

export default {
  name: 'Player',

  components: {
    Control,
    TimeLine,
  },

  props: {
    file: {
      type: String,
      default: '',
    },

    autoPlay: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      audio: createAudio({
        src: this.file,
        autoPlay: this.autoPlay,
      }),
      showVolume: false,
    };
  },

  methods: {
    download() {
      window.open(this.file, '_self');
    },

    rewind(position) {
      this.audio.element.currentTime = this.audio.element.duration * position;
    },

    switchPlaying() {
      this.audio.playing = !this.audio.playing;
    },

    async switchLoop() {
      this.audio.element.loop = !this.audio.element.loop;
      await this.$forceUpdate();
    },

    async mute() {
      this.audio.mute();
      await this.$forceUpdate();
    },

    setShowVolume(state) {
      this.showVolume = state;
    },
  },
};
</script>

<style scoped lang="less">
@import '~@/style/variables.less';

.player {
  display: inline-flex;
  border: 1px solid @player-border-color;
  border-radius: 5px;
  line-height: 1.5625;
  color: @player-text-color;
  background-color: @player-bg;
  box-shadow: 0 5px 8px rgba(0,0,0,0.15);
}
</style>
