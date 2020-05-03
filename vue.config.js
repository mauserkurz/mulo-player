module.exports = {
  devServer: {
    proxy: 'http://localhost:3000',
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: 'index.html',
      exclude: [
        /\.map$/,
        /manifest\.json$/,
      ],
    },
    themeColor: '#009688',
    msTileColor: '#000',
    appleMobileWebAppCapable: 'no',
    appleMobileWebAppStatusBarStyle: 'default',
    manifestOptions: {},
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
  },
};
