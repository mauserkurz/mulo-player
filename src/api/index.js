import axios from 'axios';
import { API_URL as baseURL } from '@/constants';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  crossDomain: true,
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

  async loadTrack({ userID, trackID, cancelToken }) {
    return API.get(`user/${userID}/soundtracks/${trackID}.mp3`, {
      responseType: 'blob',
      Accept: 'audio/mpeg',
      timeout: 60 * 1000,
      cancelToken,
    });
  },

  async sendTrack({ userID, file }) {
    const data = new FormData();

    data.append('tracks', file, file.name);

    return axios.post(
      `${baseURL}user/${userID}/soundtracks/upload`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        crossDomain: true,
        withCredentials: true,
      },
    );
  },
};
