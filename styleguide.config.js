const path = require("path");
const { version } = require("./package.json");

module.exports = {
  title: `React Shopify v${version}`,
  components: "src/containers/[A-Z]*/index.js",
  showUsage: true,
  webpackConfig: require("./webpack.config.js"),
  styleguideDir: "docs",
  sections: [
    {
      name: "Basics",
      sections: [
        {
          name: "Introduction",
          content: "src/docs/introduction.md"
        },
        {
          name: "Installation",
          content: "src/docs/installation.md"
        },
        {
          name: "Getting Started",
          content: "src/docs/getting-started.md"
        }
      ]
    },
    {
      name: "Components",
      components: "src/containers/[A-Z]*/index.js"
    }
  ],
  styleguideComponents: {
    LogoRenderer: path.join(__dirname, "styleguidist/Logo")
  },
  theme: {
    color: {
      link: "#845EC2",
      linkHover: "#D65DB1"
    }
  }
};
