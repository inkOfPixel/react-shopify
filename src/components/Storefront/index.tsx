import * as React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

interface Props {
  children: React.ReactNode;
  /** Shopify Storefront API access token */
  accessToken: string;
  /** Endpoint of your store GraphQL API */
  url: string;
}

export default class Storefront extends React.Component<Props, {}> {
  static defaultProps = { url: "/api/graphql" };

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
    const { children } = this.props;
    return (
      <ApolloProvider client={this.client}>
        <React.Fragment>{children}</React.Fragment>
      </ApolloProvider>
    );
  }
}
