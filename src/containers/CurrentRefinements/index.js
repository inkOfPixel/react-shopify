// @flow

import React, { type Node } from "react";
import type { CollectionContext, CollectionState } from "../Collection/types";
import { withCollection } from "../Collection/";

type RefinementTypes = "refinementList" | "range";

type ClearOptions = {
  value?: mixed
};

type Props = {
  /** A function to which refinement props are passed and made available for render */
  children: ({
    refinements: $PropertyType<CollectionState, "refinements">,
    clear: (
      type: RefinementTypes,
      attribute: string,
      options?: ClearOptions
    ) => void,
    clearAll: () => void
  }) => Node,
  /** @ignore */
  collection: CollectionContext
};

/** The `CurrentRefinements` component provides the logic to build a widget that will give the user the ability to remove all or some of the filters that were set. */
class CurrentRefinements extends React.Component<Props> {
  clear = (
    type: RefinementTypes,
    attribute: string,
    options?: ClearOptions = {}
  ) => {
    const {
      collectionState: { refinements },
      updateCollectionState
    } = this.props.collection;
    switch (type) {
      case "refinementList":
        if (
          refinements.refinementList &&
          refinements.refinementList[attribute]
        ) {
          if (options.value) {
            updateCollectionState({
              refinements: {
                ...refinements,
                refinementList: {
                  ...refinements.refinementList,
                  [attribute]: {
                    ...refinements.refinementList[attribute],
                    values: refinements.refinementList[attribute].values.filter(
                      refValue => refValue !== options.value
                    )
                  }
                }
              }
            });
          } else {
            const {
              [attribute]: toBeRemoved,
              ...other
            } = refinements.refinementList;
            updateCollectionState({
              refinements: {
                ...refinements,
                refinementList: other
              }
            });
          }
        }
        break;
      case "range":
        if (refinements.range && refinements.range[attribute]) {
          const { [attribute]: toBeRemoved, ...other } = refinements.range;
          updateCollectionState({
            refinements: { ...refinements, range: other }
          });
        }
        break;
      default:
        break;
    }
  };

  clearAll = () => {
    this.props.collection.updateCollectionState({ refinements: {} });
  };

  render() {
    const {
      collection: {
        collectionState: { refinements }
      },
      children
    } = this.props;
    return children({
      refinements,
      clear: this.clear,
      clearAll: this.clearAll
    });
  }
}

export default withCollection(CurrentRefinements);
