const { version } = require("./package.json");

module.exports = {
  title: `React Shopify v${version}`,
  components: "src/components/[A-Z]*/index.js",
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
      components: "src/components/[A-Z]*/index.js"
    }
  ],
  theme: {
    color: {
      link: "#845EC2",
      linkHover: "#D65DB1"
    }
  }
};
