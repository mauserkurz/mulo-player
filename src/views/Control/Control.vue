<template>
  <button
    :title="title"
    class="control"
    type="button"
    @click.prevent="onClick">
    <img
      v-show="!isActive"
      :src="require(`@/assets/${iconName}.svg`)"
      :alt="alt"
      width="20"
      height="20">

    <img
      v-if="activeIconName"
      v-show="isActive"
      :src="require(`@/assets/${activeIconName}.svg`)"
      :alt="activeIconAlt"
      width="20"
      height="20">

    <slot/>
  </button>
</template>

<script>
export default {
  name: 'Control',

  props: {
    title: {
      type: String,
      required: true,
    },

    iconName: {
      type: String,
      required: true,
    },

    activeIconName: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    alt() {
      return `${this.iconName} icon`;
    },

    activeIconAlt() {
      return `${this.activeIconName} icon`;
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped lang="less">
@import '~@/style/variables.less';

.control {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  padding: 16px;
  border-right: 1px solid @player-border-color;
  line-height: 0;
  color: @player-control-color;

  &:last-child {
    border-right: none;
  }
}
</style>
