const path = require("path");
const webpackRxjsExternals = require("webpack-rxjs-externals");
const nodeExternals = require("webpack-node-externals");

const externalsList = [
  //nodeExternals({}),
  webpackRxjsExternals()
];

const config = {
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.csv$/,
        exclude: /(node_modules)/,
        use: {
          loader: "csv-loader",
          options: {
            dynamicTyping: true,
            header: false,
            skipEmptyLines: true
          }
        }
      }
    ]
  },
  devServer: {
    compress: true,
    port: 9000
  }
};

const library = "EEGPipes";
const libraryFileName = "eeg-pipes";

const exportLibrary = ({
  libraryTarget = "umd",
  filename = `${libraryFileName}.${libraryTarget}.js`,
  chunkFilename = `${libraryFileName}.[name].${libraryTarget}.js`,
  externals = externalsList,
  devtool   = "eval"
} = {}) =>
  Object.assign({}, config, {
    externals,
    devtool,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename,
      chunkFilename,
      library,
      libraryTarget,
      globalObject: "this"
    }
  });

module.exports = [
  exportLibrary({
    libraryTarget: "umd"
  }),
  exportLibrary({
    libraryTarget: "var"
  }),
  exportLibrary({
    filename: "electron.js",
    libraryTarget: "commonjs2",
    externals: []
  }),
  exportLibrary({
    filename: `${libraryFileName}.react.js`,
    libraryTarget: "commonjs2",
    devtool: false,
    externals: []
  }),
];
