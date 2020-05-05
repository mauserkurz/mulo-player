import Vuex from 'vuex';
import Vue from 'vue';
import clone from 'ramda/src/clone';
import flushPromises from 'flush-promises';
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

      tracksCopy.state.currentTrackID = '1';
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
      const trackID = '2';
      const track = createTrack({ id: trackID });

      tracksCopy.state.currentTrackID = '1';
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
          const getLastModifiedDate = value => new Date(value).getTime()
            + new Date(value).getTimezoneOffset() * 60 * 1000;
          const trackList = [
            {
              id: 0,
              name: 'Band 0 - Track 0',
              dateLoad: '2020-04-18T08:20:10.0000000',

              get lastModifiedDate() {
                return getLastModifiedDate(this.dateLoad);
              },
            },
            {
              id: 1,
              name: 'Band 1 - Track 1',
              dateLoad: '2020-04-19T09:20:10.0000000',

              get lastModifiedDate() {
                return getLastModifiedDate(this.dateLoad);
              },
            },
            {
              id: 2,
              name: 'Band 2 - Track 2',
              dateLoad: '2020-04-20T07:20:10.0000000',

              get lastModifiedDate() {
                return getLastModifiedDate(this.dateLoad);
              },
            },
            {
              id: 3,
              name: 'Band 3 - Track 3',
              dateLoad: '2020-04-21T10:20:10.0000000',

              get lastModifiedDate() {
                return getLastModifiedDate(this.dateLoad);
              },
            },
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
            { id: '0', name: 'Band 0 - Track 0', dateLoad: '2020-04-18T08:20:10.0000000' },
            { id: '1', name: 'Band 1 - Track 1', dateLoad: '2020-04-19T09:20:10.0000000' },
            { id: '2', name: 'Band 2 - Track 2', dateLoad: '2020-04-20T07:20:10.0000000' },
            { id: '3', name: 'Band 3 - Track 3', dateLoad: '2020-04-21T10:20:10.0000000' },
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

        it('should clear list of tracks if received empty list', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);

          tracksCopy.state.trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '1', name: 'Band 1 - Track 1' },
            { id: '2', name: 'Band 2 - Track 2' },
            { id: '3', name: 'Band 3 - Track 3' },
          ];
          userCopy.state.userID = '01234';
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.getAllTracksInfo;

          api.getAllTracksInfo = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: [] },
          }));
          await store.dispatch('tracks/getTrackList');
          api.getAllTracksInfo = handler;
          expect(store.state.tracks.trackList).toEqual([]);
        });

        it('should clear currentTrackID if received empty track list', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);

          tracksCopy.state.currentTrackID = 3;
          userCopy.state.userID = '01234';
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.getAllTracksInfo;

          api.getAllTracksInfo = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: [] },
          }));
          await store.dispatch('tracks/getTrackList');
          api.getAllTracksInfo = handler;
          expect(store.state.tracks.currentTrackID).toBeNull();
        });
      });

      it('updateTrackList action should rewrite track list', () => {
        const tracksCopy = clone(tracks);
        const userCopy = clone(user);
        const trackList = [
          { id: '0', name: 'Band 0 - Track 0' },
          { id: '1', name: 'Band 1 - Track 1' },
          { id: '2', name: 'Band 2 - Track 2' },
          { id: '3', name: 'Band 3 - Track 3' },
        ];

        tracksCopy.state.trackList = [
          { id: '3', name: 'Band 3 - Track 3' },
          { id: '2', name: 'Band 2 - Track 2' },
          { id: '1', name: 'Band 1 - Track 1' },
          { id: '0', name: 'Band 0 - Track 0' },
        ];
        const store = createStore({ tracks: tracksCopy, user: userCopy });

        store.dispatch('tracks/updateTrackList', trackList);
        expect(store.state.tracks.trackList).toEqual(trackList);
      });

      describe('getTrack action', () => {
        it('should call API.loadTrack', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '12345';
          const trackID = '5';
          const blob = new Blob([], { type: 'audio/mpeg' });
          const trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '5', name: 'Band 5 - Track 5' },
            { id: '4', name: 'Band 4 - Track 4' },
            { id: '3', name: 'Band 3 - Track 3' },
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
          expect(spy.mock.calls).toEqual([[{
            userID,
            trackID,
            cancelToken: { promise: new Promise(() => {}) },
          }]]);
        });

        it('should save blob for track', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '12345';
          const trackID = '5';
          const blob = new Blob([], { type: 'audio/mpeg' });
          const trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '5', name: 'Band 5 - Track 5' },
            { id: '4', name: 'Band 4 - Track 4' },
            { id: '3', name: 'Band 3 - Track 3' },
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

        it('should save cancelSource of request', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '12345';
          const trackID = '5';
          const trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '5', name: 'Band 5 - Track 5' },
            { id: '4', name: 'Band 4 - Track 4' },
            { id: '3', name: 'Band 3 - Track 3' },
          ].map(createTrack);

          userCopy.state.userID = userID;
          tracksCopy.state.trackList = trackList;
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.loadTrack;

          api.loadTrack = jest.fn(() => Promise.resolve({
            status: 200,
            data: new Blob([], { type: 'audio/mpeg' }),
          }));
          store.dispatch('tracks/getTrack', trackID);

          const sourceCount = Object.values(store.state.tracks.loadTrackCancelSourceMap).length;
          await flushPromises();
          api.loadTrack = handler;
          expect(sourceCount).toBe(1);
        });

        it('should remove cancelSource after request', async () => {
          const tracksCopy = clone(tracks);
          const userCopy = clone(user);
          const userID = '12345';
          const trackID = '5';
          const trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '5', name: 'Band 5 - Track 5' },
            { id: '4', name: 'Band 4 - Track 4' },
            { id: '3', name: 'Band 3 - Track 3' },
          ].map(createTrack);

          userCopy.state.userID = userID;
          tracksCopy.state.trackList = trackList;
          const store = createStore({ tracks: tracksCopy, user: userCopy });
          const handler = api.loadTrack;

          api.loadTrack = jest.fn(() => Promise.resolve({
            status: 200,
            data: new Blob([], { type: 'audio/mpeg' }),
          }));
          await store.dispatch('tracks/getTrack', trackID);
          api.loadTrack = handler;
          const sourceCount = Object.values(store.state.tracks.loadTrackCancelSourceMap).length;

          expect(sourceCount).toBe(0);
        });
      });

      describe('cancelGettingTrack action', () => {
        it('should cancel request of getting track', async () => {
          const tracksCopy = clone(tracks);
          const trackID = '2';
          const spy = jest.fn(() => {});

          tracksCopy.state.trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '1', name: 'Band 1 - Track 1' },
            { id: '2', name: 'Band 2 - Track 2' },
            { id: '3', name: 'Band 3 - Track 3' },
          ].map(createTrack);
          tracksCopy.state.loadTrackCancelSourceMap = {
            0: {},
            1: {},
            [trackID]: { cancel: spy },
            3: {},
          };
          const store = createStore({ tracks: tracksCopy });

          await store.dispatch('tracks/cancelGettingTrack', trackID);
          expect(spy).toHaveBeenCalled();
        });

        it('should set isLoading: false for canceled track', async () => {
          const tracksCopy = clone(tracks);
          const trackID = '2';

          tracksCopy.state.trackList = [
            { id: '0', name: 'Band 0 - Track 0' },
            { id: '1', name: 'Band 1 - Track 1' },
            { id: '2', name: 'Band 2 - Track 2', isLoading: true },
            { id: '3', name: 'Band 3 - Track 3' },
          ].map(createTrack);
          tracksCopy.state.loadTrackCancelSourceMap = {
            0: {},
            1: {},
            [trackID]: { cancel() {} },
            3: {},
          };
          const store = createStore({ tracks: tracksCopy });

          await store.dispatch('tracks/cancelGettingTrack', trackID);
          expect(store.state.tracks.trackList[2].isLoading).toBe(false);
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

      it('clearError should clear state.sendingFileError', () => {
        const tracksCopy = clone(tracks);

        tracksCopy.state.sendingFileError = 'Some sending error';
        const store = createStore({ tracks: tracksCopy });

        store.dispatch('tracks/clearError');
        expect(store.state.tracks.sendingFileError).toBe('');
      });

      describe('sendFile handle music file uploading to server and add file in client', () => {
        it('should call API method', async () => {
          const userCopy = clone(user);
          const tracksCopy = clone(tracks);
          const userID = '012345';
          const file = new File([], 'track', { type: 'audio/mpeg' });

          userCopy.state.userID = userID;
          const store = createStore({ user: userCopy, tracks: tracksCopy });
          const params = { userID, file: { file } };
          const handler = api.sendTrack;
          const spy = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: [{ id: 0, name: 'track' }] },
          }));

          api.sendTrack = spy;
          await store.dispatch('tracks/sendFile', { file });
          api.sendTrack = handler;
          expect(spy).toBeCalledWith(params);
        });

        it('should after request add file', async () => {
          const userCopy = clone(user);
          const tracksCopy = clone(tracks);
          const file = new File([], 'track', { type: 'audio/mpeg' });
          const store = createStore({ user: userCopy, tracks: tracksCopy });
          const handler = api.sendTrack;

          api.sendTrack = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: [{ id: 0, name: 'track' }] },
          }));
          await store.dispatch('tracks/sendFile', { file });
          api.sendTrack = handler;
          expect(store.state.tracks.trackList[0].blob).toEqual({ file });
        });

        it('should after request clear error', async () => {
          const userCopy = clone(user);
          const tracksCopy = clone(tracks);
          const file = new File([], 'track', { type: 'audio/mpeg' });

          tracksCopy.state.sendingFileError = 'Some error';
          const store = createStore({ user: userCopy, tracks: tracksCopy });
          const handler = api.sendTrack;

          api.sendTrack = jest.fn(() => Promise.resolve({
            status: 200,
            data: { tracks: [{ id: 0, name: 'track' }] },
          }));
          await store.dispatch('tracks/sendFile', { file });
          api.sendTrack = handler;
          expect(store.state.tracks.sendingFileError).toBe('');
        });

        it('should after response with 500 status show message', async () => {
          const userCopy = clone(user);
          const tracksCopy = clone(tracks);
          const file = new File([], 'track', { type: 'audio/mpeg' });
          const error = new Error('Request failed with status code 500');

          error.response = { status: 500, statusText: 'Internal Server Error' };
          tracksCopy.state.sendingFileError = 'Some error';
          const store = createStore({ user: userCopy, tracks: tracksCopy });
          const handler = api.sendTrack;

          api.sendTrack = jest.fn(() => Promise.reject(error));
          await store.dispatch('tracks/sendFile', { file });
          api.sendTrack = handler;
          expect(store.state.tracks.sendingFileError)
            .toBe('Internal Server Error: Error: Request failed with status code 500');
        });
      });
    });
  });
});
