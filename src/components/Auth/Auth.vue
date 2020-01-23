<template>
  <v-content class="auth">
    <v-container
      class="fill-height"
      fluid>
      <v-row
        align="center"
        justify="center">
        <v-col
          cols="12"
          sm="8"
          md="4">
          <AuthForm
            :loading="isAuthLoading"
            :error="error"
            @submit="auth"
            @toggle-type="clearError"/>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AuthForm from '@/views/AuthForm/AuthForm.vue';

export default {
  name: 'Auth',

  components: { AuthForm },

  computed: {
    ...mapState('user', ['error', 'isAuthLoading']),
  },

  methods: {
    ...mapActions('user', ['auth', 'clearError']),
  },
};
</script>

<style scoped lang="less">
.auth {}
</style>
