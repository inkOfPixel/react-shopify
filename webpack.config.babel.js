import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import { camelCase, upperFirst } from "lodash";
import packageJson from "./package.json";

export default () => ({
  mode: "production",
  entry: "./src/components/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: `${packageJson.name}.js`,
    library: upperFirst(camelCase(packageJson.name)),
    libraryTarget: "umd",
    globalObject: "this"
  },
  externals: [nodeExternals()],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  },
  plugins: [new CleanWebpackPlugin(["dist"]), new UglifyJSPlugin()]
});
