import axios from 'axios';
import { API_URL as baseURL } from '@/const';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 2000,
});

export default {
  async signIn({ login, password }) {
    return API.post('authorization', { login, password });
  },

  async signUp({ login, password }) {
    return API.post('registration', { login, password });
  },

  async logout() {
    return API.post('logout', {});
  },

  async getUser() {
    return API.post('user', {});
  },

  async getAllTracksInfo({ userID }) {
    return API.get(`user/${userID}/soundtracks`);
  },

  async loadTrack({ userID, trackID }) {
    return API.get(`user/${userID}/soundtracks/${trackID}.mp3`, {
      responseType: 'blob',
      Accept: 'audio/mpeg',
      timeout: 60 * 1000,
    });
  },

  async sendTrack({ userID }) {
    return API.post(`user/${userID}/soundtracks/upload`);
  },
};
