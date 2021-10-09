const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    historyApiFallback: true
  },
  externalsType: 'script',
  externals: {
    react: ['https://unpkg.com/react@17/umd/react.development.js', 'React'],
    'react-dom': [
      'https://unpkg.com/react-dom@17/umd/react-dom.development.js',
      'ReactDOM',
    ],
    'react-is': [
      'https://unpkg.com/react-is@16.8.3/umd/react-is.development.js',
    "ReactIs"],
  },
});
