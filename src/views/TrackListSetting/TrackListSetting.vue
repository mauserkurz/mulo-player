<template>
  <v-row class="track-list-setting">
    <v-col cols="4">
      <v-select
        :value="filterType"
        :items="filterTypeList"
        item-text="text"
        item-value="type"
        @input="onFilterTypeInput"/>
    </v-col>

    <v-col cols="4">
      <v-select
        :value="sortType"
        :items="sortTypeList"
        item-text="text"
        item-value="type"
        @input="onSortTypeInput"/>
    </v-col>
  </v-row>
</template>

<script>
import { SORT_TRACK_TYPE_LIST, FILTER_TRACK_TYPE_LIST } from '@/constants';

export default {
  name: 'TrackListSetting',

  props: {
    sortType: {
      type: String,
      required: true,
    },

    filterType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      sortTypeList: SORT_TRACK_TYPE_LIST,
      filterTypeList: FILTER_TRACK_TYPE_LIST,
    };
  },

  methods: {
    onSortTypeInput(value) {
      this.$emit('input-sort-type', value);
    },

    onFilterTypeInput(value) {
      this.$emit('input-filter-type', value);
    },
  },
};
</script>

<style scoped lang="less">
.track-list-setting {}
</style>
