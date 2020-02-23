import utils from '@/utils';

export const THEME = {
  themes: {
    light: {
      primary: '#009688',
      secondary: '#00bcd4',
      accent: '#fff',
      error: '#F44336',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
    },
  },
};
export const API_URL = utils.isProd() ? 'http://mulo-api.uxp.ru/' : '/api/';
export const AUTH_FORM_TYPE_MAP = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
};
export const STATUS_MAP = {
  UNAUTHORIZED: 401,
};
export const API_ERROR_MAP = {
  AUTH: {
    INCORRECT_PASSWORD_OR_LOGIN: 'Incorrect login or password, try to use another data',
    EXISTING_USER: 'User with such login and password already exists',
  },
};
export const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEXP = /^[\w\d]*$/;
export const DEFAULT_VOLUME = 0.35;
