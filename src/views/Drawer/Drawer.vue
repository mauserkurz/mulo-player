<template>
  <v-navigation-drawer
    :value="value"
    class="drawer"
    right
    fixed
    temporary
    @input="onInput">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          <v-btn
            color="primary"
            small
            icon
            @click="onInput(false)">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
          Upload music
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-container>
      <v-row
        align="center"
        justify="center">
        <v-col cols="12">
          <slot/>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Drawer',

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style scoped lang="less">
.drawer {}
</style>
