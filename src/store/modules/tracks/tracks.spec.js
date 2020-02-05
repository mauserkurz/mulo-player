import Vuex from 'vuex';
import Vue from 'vue';
import clone from 'ramda/src/clone';
import api from '@/api/';
import createTrack from '@/models/track/createTrack';
import user from '../user';
import tracks from './index';

Vue.use(Vuex);

describe('Module tracks', () => {
  const createStore = ({ ...modules } = {}) => new Vuex.Store({
    namespaced: true,

    modules: Object.assign({ tracks, user }, modules),
  });

  describe('getters', () => {
    it('currentTrack should get currentTrack data from list', () => {
      const tracksCopy = clone(tracks);
      const currentTrack = createTrack({ id: 1 });

      tracksCopy.state.currentTrackID = 1;
      tracksCopy.state.trackList = [
        createTrack({ id: 0 }),
        currentTrack,
        createTrack({ id: 2 }),
      ];
      const store = createStore({ tracks: tracksCopy });

      expect(store.getters['tracks/currentTrack']).toBe(currentTrack);
    });

    it('currentTrack should return empty object if has no data', () => {
      const tracksCopy = clone(tracks);
      const store = createStore({ tracks: tracksCopy });

      expect(store.getters['tracks/currentTrack']).toEqual({});
    });

    it('currentTrack should get currentTrack data from list', () => {
      const tracksCopy = clone(tracks);
      const trackID = 2;
      const track = createTrack({ id: trackID });

      tracksCopy.state.currentTrackID = 1;
      tracksCopy.state.trackList = [
        createTrack({ id: 0 }),
        createTrack({ id: 1 }),
        track,
        createTrack({ id: 3 }),
      ];
      const store = createStore({ tracks: tracksCopy });

      expect(store.getters['tracks/track'](trackID)).toBe(track);
    });

    describe('actions', () => {
      describe('getTrackList action', () => {
        it('should call API.getAllTracksInfo with userID', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '01234';

          userCopy.state.userID = userID;
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.getAllTracksInfo;
          const spy = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: [] },
          }));

          api.getAllTracksInfo = spy;
          await store.dispatch('tracks/getTrackList');
          api.getAllTracksInfo = handler;
          expect(spy.mock.calls).toEqual([[{ userID }]]);
        });

        it('should safe data.tracks as formatted trackList', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const trackList = [
            { id: 0, name: 'Band 0 - Track 0' },
            { id: 1, name: 'Band 1 - Track 1' },
            { id: 2, name: 'Band 2 - Track 2' },
            { id: 3, name: 'Band 3 - Track 3' },
          ];

          userCopy.state.userID = '01234';
          tracksCopy.actions.switchTrack = () => Promise.resolve();
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.getAllTracksInfo;

          api.getAllTracksInfo = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: trackList },
          }));
          await store.dispatch('tracks/getTrackList');
          api.getAllTracksInfo = handler;
          expect(store.state.tracks.trackList).toEqual(trackList.map(createTrack));
        });

        it('should call switchTrack action', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const trackList = [
            { id: 0, name: 'Band 0 - Track 0' },
            { id: 1, name: 'Band 1 - Track 1' },
            { id: 2, name: 'Band 2 - Track 2' },
            { id: 3, name: 'Band 3 - Track 3' },
          ];
          const spy = jest.fn();

          userCopy.state.userID = '01234';
          tracksCopy.actions.switchTrack = spy;
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.getAllTracksInfo;

          api.getAllTracksInfo = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: trackList },
          }));
          await store.dispatch('tracks/getTrackList');
          api.getAllTracksInfo = handler;
          expect(spy.mock.calls[0][1]).toEqual(trackList[0].id);
        });
      });

      describe('getTrack action', () => {
        it('should call API.loadTrack', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '12345';
          const trackID = 5;
          const blob = new Blob([], { type: 'audio/mpeg' });
          const trackList = [
            { id: 0, name: 'Band 0 - Track 0' },
            { id: 5, name: 'Band 5 - Track 5' },
            { id: 4, name: 'Band 4 - Track 4' },
            { id: 3, name: 'Band 3 - Track 3' },
          ].map(createTrack);

          userCopy.state.userID = userID;
          tracksCopy.state.trackList = trackList;
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.loadTrack;
          const spy = jest.fn(() => Promise.resolve({
            status: 200,
            data: blob,
          }));

          api.loadTrack = spy;
          await store.dispatch('tracks/getTrack', trackID);
          api.loadTrack = handler;
          expect(spy.mock.calls).toEqual([[{ userID, trackID }]]);
        });

        it('should save blob for track', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '12345';
          const trackID = 5;
          const blob = new Blob([], { type: 'audio/mpeg' });
          const trackList = [
            { id: 0, name: 'Band 0 - Track 0' },
            { id: 5, name: 'Band 5 - Track 5' },
            { id: 4, name: 'Band 4 - Track 4' },
            { id: 3, name: 'Band 3 - Track 3' },
          ].map(createTrack);

          userCopy.state.userID = userID;
          tracksCopy.state.trackList = trackList;
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.loadTrack;

          api.loadTrack = jest.fn(() => Promise.resolve({
            status: 200,
            data: blob,
          }));
          await store.dispatch('tracks/getTrack', trackID);
          api.loadTrack = handler;
          expect(store.state.tracks.trackList[1].blob).toEqual(blob);
        });
      });

      describe('switchTrack action', () => {
        it('should call getTrack', async () => {
          const tracksCopy = clone(tracks);
          const trackID = 2;
          const spy = jest.fn(() => Promise.resolve());

          tracksCopy.actions.getTrack = spy;
          const store = createStore({ tracks: tracksCopy });

          await store.dispatch('tracks/switchTrack', trackID);
          expect(spy.mock.calls[0][1]).toEqual(trackID);
        });

        it('should save currentTrackID', async () => {
          const tracksCopy = clone(tracks);
          const trackID = 2;

          tracksCopy.actions.getTrack = () => Promise.resolve();
          const store = createStore({ tracks: tracksCopy });

          await store.dispatch('tracks/switchTrack', trackID);
          expect(store.state.tracks.currentTrackID).toBe(trackID);
        });
      });
    });
  });
});
