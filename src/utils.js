export default {
  isProd() {
    return process.env.NODE_ENV === 'production';
  },
};
