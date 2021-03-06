import utils from '@/utils';

export const THEME = {
  themes: {
    light: {
      primary: '#009688',
      secondary: '#00bcd4',
      accent: '#d6d6d6',
      error: '#F44336',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
    },
  },
};
export const API_URL = utils.isProd() ? 'https://api-playermusiclover.herokuapp.com/' : '/api/';
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
  CANCELED_BY_USER: 'CANCELED_BY_USER',
};
export const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEXP = /^[\w\d]*$/;
export const DEFAULT_VOLUME = 0.35;
export const MAX_FILE_SIZE = (10 ** 6) * 40;
export const SORT_TRACK_TYPE_KEYS = {
  ABC: 'abc',
  CBA: 'cba',
  NEW: 'new',
  OLD: 'old',
  CUSTOM: 'custom',
};
export const SORT_TRACK_TYPE_LIST = [
  { type: SORT_TRACK_TYPE_KEYS.ABC, text: 'From A to Z' },
  { type: SORT_TRACK_TYPE_KEYS.CBA, text: 'From Z to A' },
  { type: SORT_TRACK_TYPE_KEYS.NEW, text: 'New at first' },
  { type: SORT_TRACK_TYPE_KEYS.OLD, text: 'Old at first' },
  { type: SORT_TRACK_TYPE_KEYS.CUSTOM, text: 'Custom' },
];
export const FILTER_TRACK_TYPE_KEYS = {
  TEXT: 'text',
  NEW: 'new',
  OLD: 'old',
  DURING: 'during',
};
export const FILTER_TRACK_TYPE_LIST = [
  { type: FILTER_TRACK_TYPE_KEYS.TEXT, text: 'Search name' },
  { type: FILTER_TRACK_TYPE_KEYS.NEW, text: 'Newer than' },
  { type: FILTER_TRACK_TYPE_KEYS.OLD, text: 'Older than' },
  { type: FILTER_TRACK_TYPE_KEYS.DURING, text: 'During' },
];
