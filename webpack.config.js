const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  entry: "./src/components/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "react-shopify.js",
    libraryTarget: "umd",
    globalObject: "this",
    // libraryExport: 'default',
    library: "ReactShopify"
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader"
      }
    ]
  }
};
