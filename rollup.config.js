import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/components/index.js",
    output: {
      name: "ReactShopify",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      resolve(),
      babel({
        exclude: ["node_modules/**"]
      }),
      commonjs({
        namedExports: {
          "node_modules/react/index.js": [
            "React",
            "cloneElement",
            "createElement",
            "PropTypes",
            "Children",
            "Component",
            "PureComponent"
          ],
          "node_modules/graphql-anywhere/lib/async.js": ["graphql"]
        }
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/components/index.js",
    external: ["react", "react-dom"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      babel({
        exclude: ["node_modules/**"]
      })
    ]
  }
];
