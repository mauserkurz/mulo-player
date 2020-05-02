const DEFAULT_BLOB = null;

class Track {
  constructor({
    id = '',
    name = '',
    blob = DEFAULT_BLOB,
    lastModifiedDate = new Date().getTime(),
    isLoading = false,
  }) {
    this.id = id;
    this.name = name;
    this.blob = blob;
    this.lastModifiedDate = lastModifiedDate;
    this.isLoading = isLoading;
  }

  get isLoaded() {
    return this.blob !== DEFAULT_BLOB;
  }
}

export default options => new Track(options);
