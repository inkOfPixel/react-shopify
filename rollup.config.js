import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import bundleSize from "rollup-plugin-bundle-size";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/main.ts",
    output: {
      file: pkg.browser,
      format: "umd",
      name: "ReactShopify"
    },
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({
        extensions: [".ts", ".tsx"],
        exclude: ["node_modules/**"]
      }),
      bundleSize()
    ],
    external: ["react", "react-apollo", "graphql-tag", "apollo-boost"]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: "src/main.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
      }),
      babel({
        extensions: [".ts", ".tsx"],
        exclude: ["node_modules/**"]
      }),
      bundleSize()
    ],
    external: ["react", "react-apollo", "graphql-tag", "apollo-boost"]
  }
];
