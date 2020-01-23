<template>
  <div class="player-wrap">
    <img alt="App logo" src="../../assets/logo.svg" width="256" height="256">
    <Player file="URL"/>
  </div>
</template>

<script>
import Player from '@/views/Player/Player.vue';

export default {
  name: 'Auth',
  components: { Player },

  data() {
    return { URL: '' };
  },
};
</script>

<style scoped lang="less">
.player-wrap {}
</style>
