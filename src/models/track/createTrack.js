const DEFAULT_BLOB = null;

export default ({
  id = '',
  name = '',
  blob = DEFAULT_BLOB,
  lastModifiedDate = new Date().getTime(),
  isLoading = false,
}) => ({
  id: `${id}`,
  name,
  blob,
  lastModifiedDate,
  isLoading,

  get isLoaded() {
    return this.blob !== DEFAULT_BLOB;
  },
});
