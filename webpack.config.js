const path = require("path");

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
  externals: {},
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
