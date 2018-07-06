// @flow

import React, { type Node, PureComponent } from "react";
import type { EnumAttributeValue } from "../types";
import { withCollection } from "../Collection/";
import type { CollectionContext } from "../Collection/types";

type Props = {
  /** A function to which refinement props are passed and made available for render */
  children: ({
    refine: (value: mixed) => void,
    clear: () => void,
    items: Array<EnumAttributeValue<mixed>>
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
class RefinementList extends PureComponent<Props> {
  static defaultProps = {
    operator: "or"
  };

  toggle = (value: string | number) => {
    const {
      context: { clearRefinement, updateRefinement, refinements },
      attribute,
      operator
    } = this.props;
    const refinement = refinements[attribute];
    if (refinement && refinement.type !== "multiple") {
      throw new Error(
        `RefinementList received a refinement of type ${
          refinement.type
        } for attribute ${attribute}`
      );
    }
    let values = refinement ? refinement.values : [];
    if (values.includes(value)) {
      if (values.length > 1) {
        values = values.filter(refVal => refVal !== value);
        updateRefinement({ attribute, type: "multiple", operator, values });
      } else {
        clearRefinement(attribute);
      }
    } else {
      values = values.concat(value);
      updateRefinement({ attribute, type: "multiple", operator, values });
    }
  };

  refine = (value: mixed) => {
    const { attribute, operator, collection } = this.props;
    const nextCollectionState = { ...collection.collectionState };
    nextCollectionState.refinementList =
      nextCollectionState.refinementList || {};
    nextCollectionState.refinementList[attribute] = nextCollectionState
      .refinementList[attribute] || { operator, values: [] };
    if (nextCollectionState.refinementList[attribute].values.includes(value)) {
      nextCollectionState.refinementList[
        attribute
      ].values = nextCollectionState.refinementList[attribute].values.filter(
        refValue => refValue !== value
      );
    } else {
      nextCollectionState.refinementList[attribute].values.push(value);
    }
    collection.updateCollectionState(nextCollectionState);
  };

  clear = () => {
    const { attribute, operator, collection } = this.props;
    const nextCollectionState = { ...collection.collectionState };
    if (nextCollectionState.refinementList) {
      const {
        [attribute]: __remove,
        ...other
      } = nextCollectionState.refinementList;
      nextCollectionState.refinementList = other;
      collection.updateCollectionState(nextCollectionState);
    }
  };

  render() {
    const {
      children,
      attribute,
      context: { getValuesForAttribute }
    } = this.props;
    return children({
      refine: this.refine,
      clear: this.clear,
      items: getValuesForAttribute(attribute)
    });
  }
}

export default withCollection(RefinementList);
