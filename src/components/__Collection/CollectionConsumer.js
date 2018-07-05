// @flow

import React, { type Node, PureComponent } from "react";
import { Consumer as ContextConsumer } from "./CollectionContext";

type Props = {
  children: any => Node
};

export default class CollectionConsumer extends PureComponent<Props> {
  render() {
    const { children } = this.props;
    return (
      <ContextConsumer>
        {context => {
          if (!context) {
            throw new Error(
              "Collection consumer cannot be rendered outside Collection provider"
            );
          }
          return children(context);
        }}
      </ContextConsumer>
    );
  }
}
