// @flow

import React, { type Node } from "react";
import type { RefinementListAttributeItem } from "../types";
import { withCollection } from "../Collection/";
import type { CollectionContext } from "../Collection/types";
import { getRefinementListItems } from "../utils";

type Props = {
  /** A function to which refinement props are passed and made available for render */
  children: ({
    toggle: (value: mixed) => void,
    set: (values: mixed[]) => void,
    clear: () => void,
    items: Array<RefinementListAttributeItem<mixed>>
  }) => Node,
  /** Attribute to be refined. Accepts dot notation (e.g. `namedTag.color`) */
  attribute: string,
  /** Default value for refinement */
  defaultRefinement: Array<string> | Array<number>,
  /** Operator to be applied: `and` means that the product must have each selected value, `or` when the product must have at least one of the selected values */
  operator: "and" | "or",
  /** @ignore */
  collection: CollectionContext
};

/** The `RefinementList` component provides the logic to build a widget that will give the user the ability to choose multiple values for a specific attribute. */
class RefinementList extends React.Component<Props> {
  static defaultProps = {
    operator: "or"
  };

  set = (values: mixed[]) => {
    const { attribute, operator, collection } = this.props;
    const refinements = { ...collection.collectionState.refinements };
    refinements.refinementList = refinements.refinementList || {};
    refinements.refinementList[attribute] = { operator, values };

    collection.updateCollectionState({
      refinements
    });
  };

  toggle = (value: mixed) => {
    const { attribute, operator, collection } = this.props;
    const refinements = { ...collection.collectionState.refinements };
    const refinementList = refinements.refinementList || {};
    const refinedAttributeList = refinementList[attribute] || {
      operator,
      values: []
    };

    refinements.refinementList = refinements.refinementList || {};
    refinements.refinementList[attribute] = {
      ...refinedAttributeList,
      values: refinedAttributeList.values.filter(refValue => refValue !== value)
    };
    if (refinedAttributeList.values.includes(value)) {
      refinements.refinementList[
        attribute
      ].values = refinedAttributeList.values.filter(
        refValue => refValue !== value
      );
    } else {
      refinements.refinementList[attribute].values.push(value);
    }

    collection.updateCollectionState({
      refinements
    });
  };

  clear = () => {
    const { attribute, collection } = this.props;
    const refinements = { ...collection.collectionState.refinements };

    if (refinements.refinementList) {
      const { [attribute]: __remove, ...other } = refinements.refinementList;
      refinements.refinementList = other;
      collection.updateCollectionState({
        ...collection.collectionState,
        refinements
      });
    }
  };

  render() {
    const { children, attribute, collection } = this.props;
    return children({
      set: this.set,
      toggle: this.toggle,
      clear: this.clear,
      items: getRefinementListItems(collection.collectionState, attribute)
    });
  }
}

export default withCollection(RefinementList);
