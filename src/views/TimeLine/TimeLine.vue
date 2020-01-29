<template>
  <div class="time-line">
    <div
      ref="progress"
      class="time-line__progress"
      title="Time played : Total time"
      @click="locate">
      <div
        :style="lineStyle"
        class="time-line__line"/>
    </div>
    <div class="time-line__timers">
      <div class="time-line__current">{{ this.currentSeconds | convertTime }}</div>
      <div class="time-line__total">{{ this.durationSeconds | convertTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeLine',

  props: {
    currentSeconds: {
      type: Number,
      required: true,
    },

    durationSeconds: {
      type: Number,
      required: true,
    },

    playing: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    lineStyle() {
      return { width: `${this.currentSeconds / this.durationSeconds * 100}%` };
    },
  },

  filters: {
    convertTime(val) {
      const time = new Date(val * 1000).toJSON().substr(11, 8);

      return time.indexOf('00:') === 0 ? time.substr(3) : time;
    },
  },

  methods: {
    locate(event) {
      if (!this.playing) {
        return;
      }
      const { left, width } = this.$refs.progress.getBoundingClientRect();
      const position = (event.clientX - left) / width;

      this.$emit('rewind', position);
    },
  },
};
</script>

<style scoped lang="less">
@import '~@/style/variables.less';

.time-line {
  border-right: 1px solid @player-border-color;

  &__progress {
    position: relative;
    z-index: 0;
    width: 200px;
    height: 50%;
    background-color: @player-progress-color;
    cursor: pointer;
  }
  &__line {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: @player-line-color;
  }

  &__timers {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  &__current {
    padding-left: 5px;
    font-weight: 700;
  }

  &__total {
    padding-right: 5px;
    opacity: 0.5;
  }
}
</style>
