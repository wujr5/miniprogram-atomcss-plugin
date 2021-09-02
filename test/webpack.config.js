const MiniprogramAtomcssPlugin = require('../dist/plugin');
const getFiles = MiniprogramAtomcssPlugin.getFiles;

module.exports = {
  mode: 'production',
  entry: () => {
    return getFiles('./pages')
      .filter((item => item.endsWith('.wxml')));
  },
  output: {
    path: __dirname,
    filename: 'atomcss.wxss',
  },
  module: {
    rules: [{
      test: /.wxml$/,
      use: [{
        loader: '../dist/loader.js'
      }]
    }]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: 500
  },
  plugins: [
    new MiniprogramAtomcssPlugin(),
  ]
};
