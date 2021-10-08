const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets",
          to: "assets",
          globOptions: {
            ignore: [
              "**/*.jsx",
            ],
          },
        }
      ],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    clean: true,
  },
  resolve: {
      extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
    ],
  },
  externalsType: 'script',
  externals: {
    lodash: ['https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js', '_'],
    'react': ['https://unpkg.com/react@17/umd/react.development.js', 'React'],  //works
    'react-dom': ['https://unpkg.com/react-dom@17/umd/react-dom.development.js'],  //works
    'react-router-dom': ['https://unpkg.com/react-router-dom@4.1.2/umd/react-router-dom.min.js'],  //works
    'react-is': ['https://unpkg.com/react-is@16.8.3/umd/react-is.development.js'], //works
    'formik': ['https://unpkg.com/formik/dist/formik.umd.production.min.js'],
    'style-loader': ['https://cdn.jsdelivr.net/npm/style-loader@3.3.0/dist/cjs.min.js'],
    'styled-components': ['https://cdnjs.cloudflare.com/ajax/libs/styled-components/5.3.1/styled-components.cjs.min.js'],
  //  'lodash': ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'],
    'react-notifications-component': ['https://www.unpkg.com/react-notifications@1.6.0/dist/react-notifications.js']  //works
  }


};
