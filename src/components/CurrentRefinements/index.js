// @flow

import React, { type Node, PureComponent } from "react";
import type { Refinement, RefinementMap } from "../types";
import CollectionConsumer from "../Collection/CollectionConsumer";

type Props = {
  /** A function to which refinement props are passed and made available for render */
  children: ({
    refinements: Array<Refinement>,
    clear: (attribute: string, value?: any) => void,
    clearAll: () => void
  }) => Node
};

type ConsumerProps = Props & {
  context: {
    refinements: RefinementMap,
    updateRefinement: Refinement => void,
    clearRefinement: (attribute: string) => void,
    clearAllRefinements: () => void
  }
};

class CurrentRefinementsConsumer extends PureComponent<ConsumerProps> {
  clear = (attribute: string, value?: any) => {
    const {
      context: { updateRefinement, clearRefinement, refinements }
    } = this.props;
    if (value === undefined) {
      clearRefinement(attribute);
    }
    const refinement = refinements[attribute];
    if (refinement === undefined) {
      throw new Error(`There is no refinement for attribute ${attribute}`);
    }
    switch (refinement.type) {
      case "single":
        if (refinement.value === value) {
          clearRefinement(attribute);
        }
        break;
      case "multiple":
        if (refinement.values.includes(value)) {
          if (refinement.values.length > 1) {
            const values = refinement.values.filter(refVal => refVal !== value);
            updateRefinement({
              ...refinement,
              values
            });
          } else {
            clearRefinement(attribute);
          }
        }
        break;
      default:
        break;
    }
  };

  clearAll = () => {
    this.props.context.clearAllRefinements();
  };

  render() {
    const {
      context: { refinements },
      children
    } = this.props;
    return children({
      refinements: Object.values(refinements),
      clear: this.clear,
      clearAll: this.clearAll
    });
  }
}

/** The `CurrentRefinements` component provides the logic to build a widget that will give the user the ability to remove all or some of the filters that were set. */
const CurrentRefinements = (props: Props) => (
  <CollectionConsumer>
    {context => <CurrentRefinementsConsumer {...props} context={context} />}
  </CollectionConsumer>
);

export default CurrentRefinements;
