<template>
  <v-menu
    ref="menu"
    v-model="isDatePickerShown"
    :close-on-content-click="false"
    :return-value.sync="value"
    :disabled="!isDatePickerAvailable"
    class="track-list-search"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :value="value"
        :readonly="isDatePickerAvailable"
        prepend-inner-icon="search"
        flat
        solo-inverted
        clearable
        label="Search"
        @input="onSearchInput"
        @click:clear="onSearchInput('')"/>
    </template>

    <v-date-picker
      :value="value"
      :max="today"
      :show-current="false"
      no-title
      @input="onSearchInput">
      <v-spacer/>

      <v-btn
        color="primary"
        text
        @click="switchDatePicker(false)">
        Cancel
      </v-btn>

      <v-btn
        color="primary"
        text
        @click="$refs.menu.save(value)">
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import { FILTER_TRACK_TYPE_KEYS } from '@/constants';

const DATE_FILTER_TYPE_LIST = [
  FILTER_TRACK_TYPE_KEYS.NEW,
  FILTER_TRACK_TYPE_KEYS.OLD,
  FILTER_TRACK_TYPE_KEYS.DURING,
];

export default {
  name: 'TrackListSearch',

  props: {
    value: {
      type: String,
      required: true,
    },

    filterType: {
      type: String,
      required: true,
    },
  },

  data() {
    return { isDatePickerShown: false };
  },

  computed: {
    isDatePickerAvailable() {
      return DATE_FILTER_TYPE_LIST.includes(this.filterType);
    },

    today() {
      return new Date().toISOString();
    },
  },

  watch: {
    filterType() {
      const state = this.isDatePickerAvailable;

      if (!state) {
        this.onSearchInput('');
      }
      this.switchDatePicker(state);
    },
  },

  methods: {
    switchDatePicker(state) {
      this.isDatePickerShown = state;
    },

    onSearchInput(value) {
      this.$emit('input', value || '');
    },
  },
};
</script>

<style scoped lang="less">
.track-list-search {}
</style>
