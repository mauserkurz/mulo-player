import axios from 'axios';
import { API_URL as baseURL } from '@/const';

const API = axios.create({
  baseURL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

export default {
  async signIn({ login, password }) {
    return API.post('authorization', { login, password });
  },

  async signUp({ login, password }) {
    return API.post('registration', { login, password });
  },

  async getAllTracksInfo({ userID }) {
    return API.get(`users/${userID}/soundtracks`);
  },

  async loadTrack({ userID, trackID }) {
    return API.get(`users/${userID}/soundtracks/${trackID}.mp3`, {
      responseType: 'blob',
      Accept: 'audio/mpeg',
    }, { timeout: 3000 });
  },

  async sendTrack({ userID }) {
    return API.post(`users/${userID}/soundtracks/upload`);
  },
};
