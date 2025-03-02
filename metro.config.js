const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Handling SVG files
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  // Ensure resolver is correctly pointing to the right root folder
  config.resolver = {
    ...resolver,
    alias: {
      '@': path.resolve(__dirname, 'PomPomExpense'), // Point to the PomPomExpense folder as the base folder
    },
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'), // Handling SVG files
    sourceExts: [...resolver.sourceExts, 'svg', 'js'], // Ensure `.js` is included here
  };

  return config;
})();