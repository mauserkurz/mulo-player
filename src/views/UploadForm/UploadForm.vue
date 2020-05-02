<template>
  <v-card class="upload-form">
    <v-form
      ref="form"
      @submit.prevent="submit">
      <v-card-text>
        <v-file-input
          ref="file"
          :error="hasError"
          :rules="rules"
          accept="audio/mp3, audio/mpeg"
          placeholder="Select mp3 file"
          prepend-icon="mdi-file-music"
          label="Music file"
          @change="select"/>
      </v-card-text>

      <v-expand-transition>
        <v-card-text
          v-show="hasError">
          <v-alert
            type="error"
            dense>
            {{ error }}
          </v-alert>
        </v-card-text>
      </v-expand-transition>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          :loading="loading"
          type="submit"
          color="primary">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { MAX_FILE_SIZE } from '@/constants';

export default {
  name: 'UploadForm',

  props: {
    error: {
      type: String,
      default: '',
    },

    loading: {
      type: Boolean,
      default: false,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      rules: [
        value => !!value || 'Please select mp3 file',
        value => !value || value.size < MAX_FILE_SIZE || 'File size should be less than 40 MB',
      ],
      file: null,
    };
  },

  computed: {
    hasError() {
      return !!this.error;
    },
  },

  watch: {
    isHidden(value) {
      if (value) {
        this.file = null;
        this.$refs.form.reset();
        this.$emit('clear-form');
      }
    },
  },

  methods: {
    select(file) {
      this.file = file;
    },

    submit() {
      if (this.$refs.form.validate()) {
        const typedFile = new File([this.file], this.file.name, { type: 'audio/mpeg' });

        this.$emit('submit', typedFile);
      }
    },
  },
};
</script>

<style scoped lang="less">
.upload-form {}
</style>
