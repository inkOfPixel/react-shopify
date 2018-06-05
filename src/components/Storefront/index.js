// @flow

import React, { type Node, PureComponent } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

type Props = {
  children: Node,
  /** Shopify Storefront API access token */
  accessToken: string,
  /** Specify the endpoint of the store graphql api */
  url: string
};

/** **Required** context provider for every React Shopify component. This should be placed at the root of the app */
export default class Storefront extends PureComponent<Props> {
  static defaultProps = {
    url: "/api/graphql"
  };

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
