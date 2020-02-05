class Track {
  constructor({ id = '', name = '' }) {
    this.id = id;
    this.name = name;
    this.blob = null;
  }
}

// TODO unit
export default ({ id, name }) => new Track({ id, name });
