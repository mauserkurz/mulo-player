<template>
  <div class="player-wrap">
    <img alt="App logo" src="../assets/logo.svg">
    <Player/>
  </div>
</template>

<script>
import Player from '../components/Player.vue';

// TODO replace logo
// TODO add unit
export default {
  name: 'Auth',
  components: { Player },
};
</script>

<style scoped lang="less">
.player-wrap {}
</style>
