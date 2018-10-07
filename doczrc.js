import * as path from "path";

const modifyBundlerConfig = config => {
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    "react-shopify": path.resolve(__dirname, "src/main.ts"),
    "@docs": path.resolve(__dirname, "docs")
  });

  return config;
};

export default {
  src: "./docs",
  wrapper: "docs/wrapper",
  modifyBundlerConfig,
  htmlContext: {
    head: {
      links: [
        {
          rel: "stylesheet",
          href: "https://codemirror.net/theme/oceanic-next.css"
        }
      ]
    }
  },
  themeConfig: {
    codemirrorTheme: "oceanic-next",
    logo: {
      src:
        "https://raw.githubusercontent.com/inkOfPixel/react-shopify/master/resources/react-shopify-logo.png",
      width: 200
    },
    colors: {
      primary: "#61dafb",
      grayDark: "red"
    }
  },
  typescript: true
};
