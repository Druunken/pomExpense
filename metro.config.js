const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  config.resolver = {
    ...resolver,
    alias: {
      '@': path.resolve(__dirname), // adjust if needed
    },
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg', 'ts', 'tsx', 'js'], // add ts and tsx here
  };

  config.watchFolders = [
    __dirname,
    path.resolve(__dirname, '..'), // watch your app source folder explicitly
  ];

  return config;
})();