const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  externalsType: 'script',
  externals: {
    react: ['https://unpkg.com/react@17/umd/react.production.min.js', 'React'],
    'react-dom': [
      'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
      'ReactDOM',
    ],
    'react-router-dom': [
      'https://unpkg.com/react-router-dom/umd/react-router-dom.min.js',
      'ReactRouterDOM',
    ],
    'react-is': [
      'https://unpkg.com/react-is@16.8.3/umd/react-is.production.min.js',
    "ReactIs"],
    'babel': ["https://unpkg.com/babel-standalone@6.26.0/babel.js", "Babel"],
  },
});
