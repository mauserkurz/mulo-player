<template>
  <div class="player-wrap">
    <img alt="App logo" src="../../assets/logo.svg">
    <Player/>
  </div>
</template>

<script>
import Player from '@/views/Player/Player.vue';

export default {
  name: 'Auth',
  components: { Player },
};
</script>

<style scoped lang="less">
.player-wrap {}
</style>
