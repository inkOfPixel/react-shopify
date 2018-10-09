import * as React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { ThemeProvider } from "styled-components";
import defaultTheme from "../themes/default";

interface Props {
  children: React.ReactNode;
  /** Shopify Storefront API access token */
  accessToken: string;
  /** Endpoint of your store GraphQL API */
  url: string;
  /** Pass your custom theme */
  theme?: any;
}

export default class Storefront extends React.Component<Props, {}> {
  static defaultProps = { url: "/api/graphql", theme: defaultTheme };

  client = new ApolloClient({
    uri: this.props.url,
    request: async operation => {
      operation.setContext({
        headers: {
          "X-Shopify-Storefront-Access-Token": this.props.accessToken
        }
      });
    }
  });

  render() {
    const { children, theme } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <ApolloProvider client={this.client}>{children}</ApolloProvider>
      </ThemeProvider>
    );
  }
}
