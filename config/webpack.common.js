const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/*.jsx'],
          },
        },
      ],
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
  externalsType: 'script',
  externals: {
    react: ['https://unpkg.com/react@17/umd/react.development.js', 'React'], //works
    'react-dom': [
      'https://unpkg.com/react-dom@17/umd/react-dom.development.js',
      'ReactDOM',
    ], //works
    'react-router-dom': [
      'https://unpkg.com/react-router-dom/umd/react-router-dom.min.js',
      'ReactRouterDOM',
    ], //works
    'react-is': [
      'https://unpkg.com/react-is@16.8.3/umd/react-is.development.js',
    "ReactIs"],
    'babel': ["https://unpkg.com/babel-standalone@6.26.0/babel.js", "Babel"],
  },
}
