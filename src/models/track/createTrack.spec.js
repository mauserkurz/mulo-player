import createTrack from './createTrack';

describe('Model track', () => {
  describe('isLoaded property', () => {
    it('should be true when has blob', () => {
      const blob = new Blob([], { type: 'audio/mpeg' });
      const track = createTrack({ blob });

      expect(track.isLoaded).toBe(true);
    });

    it('should be false when there is no blob', () => {
      const track = createTrack({});

      expect(track.isLoaded).toBe(false);
    });
  });
});
