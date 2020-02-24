<template>
  <v-row
    class="player-header"
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
</template>

<script>
export default {
  name: 'PlayerHeader',

  methods: {
    logout() {
      this.$emit('logout');
    },
  },
};
</script>

<style scoped lang="less">
.player-header {}
</style>
