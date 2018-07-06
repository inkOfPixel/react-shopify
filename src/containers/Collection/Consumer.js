// @flow

import React, { type Node, type ComponentType, PureComponent } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import { Consumer as ContextConsumer } from "./Context";

type Props = {
  children: any => Node
};

export class CollectionConsumer extends PureComponent<Props> {
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

export const withCollection = (
  Component: ComponentType<any>
): ComponentType<any> => {
  function Wrapper(props, ref) {
    return (
      <CollectionConsumer>
        {context => <Component collection={context} {...props} ref={ref} />}
      </CollectionConsumer>
    );
  }
  Wrapper.displayName = `withCollection(${Component.displayName ||
    Component.name})`;
  return hoistNonReactStatics(React.forwardRef(Wrapper), Component);
};
