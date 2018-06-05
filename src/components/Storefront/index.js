// @flow

import React, { type Node, PureComponent } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

type Props = {
  children: Node,
  accessToken: string,
  graphQLEndpoint: string
};

export default class Storefront extends PureComponent<Props> {
  static defaultProps = {
    graphQLEndpoint: "https://d-one-milano-dev.myshopify.com/api/graphql"
  };

  client = new ApolloClient({
    uri: this.props.graphQLEndpoint,
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
