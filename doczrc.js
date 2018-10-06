import * as path from "path";

const modifyBundlerConfig = config => {
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    "react-shopify": path.resolve(__dirname, "src/main.ts"),
    "@docs": path.resolve(__dirname, "docs")
  });

  return config;
};

export default {
  modifyBundlerConfig,
  themeConfig: {
    colors: {
      primary: "#61dafb"
    }
  },
  typescript: true
};
