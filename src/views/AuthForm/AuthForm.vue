<template>
  <v-card class="auth-form elevation-12">
    <v-form
      ref="form"
      @submit.prevent="submit">
      <v-toolbar
        color="primary"
        dark
        flat>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer/>
        <v-btn
          text
          small
          class="auth-form__sign-in-tab"
          @click="toggleType">
          Sign In
        </v-btn>
        <v-btn
          text
          small
          class="auth-form__sign-up-tab"
          @click="toggleType">
          Sign Up
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          :error="hasError"
          :rules="loginRules"
          label="Login"
          name="login"
          prepend-icon="person"
          type="email"
          v-model="login"/>

        <v-text-field
          :error="hasError"
          :rules="passwordRules"
          label="Password"
          name="password"
          prepend-icon="lock"
          type="password"
          v-model="password"/>
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
          color="primary"
          class="auth-form__submit-button">
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { AUTH_FORM_TYPE_MAP, EMAIL_REGEXP, PASSWORD_REGEXP } from '@/constants';

export default {
  name: 'AuthForm',

  props: {
    error: {
      type: String,
      default: '',
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      login: '',
      password: '',
      type: AUTH_FORM_TYPE_MAP.SIGN_IN,
      loginRules: [
        value => !!value || 'Please enter e-mail',
        value => EMAIL_REGEXP.test(value) || 'Incorrect e-mail, try again',
      ],
      passwordRules: [
        value => !!value || 'Please enter password',
        value => value.length === 6 || 'Password should contain 6 characters',
        value => PASSWORD_REGEXP.test(value)
          || 'Password should have only latin symbols and numbers',
      ],
    };
  },

  computed: {
    hasError() {
      return !!this.error;
    },

    isSignUp() {
      return this.type === AUTH_FORM_TYPE_MAP.SIGN_UP;
    },

    title() {
      return this.isSignUp ? 'Registration form' : 'Login form';
    },

    submitButtonText() {
      return this.isSignUp ? 'Submit' : 'Login';
    },
  },

  methods: {
    toggleType() {
      const type = this.isSignUp ? AUTH_FORM_TYPE_MAP.SIGN_IN : AUTH_FORM_TYPE_MAP.SIGN_UP;

      this.type = type;
      this.$emit('toggle-type', type);
    },

    submit() {
      const { login, password, type } = this;

      if (this.$refs.form.validate()) {
        this.$emit('submit', { login, password, type });
      }
    },
  },
};
</script>

<style scoped lang="less">
.auth-form {}
</style>
