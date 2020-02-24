export default {
  isProd() {
    return process.env.NODE_ENV === 'production';
  },

  createMessage(error) {
    if (error.response) {
      return `${error.response.statusText}: ${error}`;
    }
    return error.toString();
  },
};
