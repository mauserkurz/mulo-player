<template>
  <v-main class="auth">
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
          <v-row
            v-if="isUserDataLoading"
            align="center"
            justify="center">
            <v-progress-circular
              :size="60"
              indeterminate
              :color="$vuetify.theme.themes.light.primary"/>
          </v-row>

          <AuthForm
            v-else
            :loading="isAuthLoading"
            :error="error"
            @submit="auth"
            @toggle-type="clearError"/>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AuthForm from '@/views/AuthForm/AuthForm.vue';

export default {
  name: 'Auth',

  components: { AuthForm },

  computed: {
    ...mapState('user', ['error', 'isAuthLoading', 'isUserDataLoading']),
  },

  methods: {
    ...mapActions('user', ['auth', 'getUser', 'clearError']),
  },

  async mounted() {
    await this.getUser();
  },
};
</script>

<style scoped lang="less">
.auth {}
</style>
