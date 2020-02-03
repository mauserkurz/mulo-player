class Track {
  constructor({ id = '', name = '', link = '' }) {
    this.id = id;
    this.name = name;
    this.link = link;
  }
}

// TODO unit?
export default ({ id, name, link }) => new Track({ id, name, link });
